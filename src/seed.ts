import { getPayload } from "payload";
import config from "@payload-config";
import { stripe } from "./lib/stripe";

const categories = [
  {
    name: "All",
    slug: "all",
  },
  {
    name: "Fiction",
    slug: "fiction",
    color: "#D8B5FF",
    subcategories: [
      { name: "Fantasy", slug: "fantasy" },
      { name: "Science Fiction", slug: "science-fiction" },
      { name: "Mystery & Thriller", slug: "mystery-thriller" },
      { name: "Romance", slug: "romance" },
      { name: "Historical Fiction", slug: "historical-fiction" },
      { name: "Horror", slug: "horror" },
      { name: "Literary Fiction", slug: "literary-fiction" },
    ],
  },
  {
    name: "Non-Fiction",
    slug: "non-fiction",
    color: "#FFD700",
    subcategories: [
      { name: "Biographies & Memoirs", slug: "biographies-memoirs" },
      { name: "Self-Help", slug: "self-help" },
      { name: "Politics", slug: "politics" },
      { name: "True Crime", slug: "true-crime" },
      { name: "Philosophy", slug: "philosophy" },
      { name: "Religion & Spirituality", slug: "religion-spirituality" },
    ],
  },
  {
    name: "Education & Reference",
    slug: "education-reference",
    color: "#96E6B3",
    subcategories: [
      { name: "Textbooks", slug: "textbooks" },
      { name: "Study Guides", slug: "study-guides" },
      { name: "Language Learning", slug: "language-learning" },
      { name: "Encyclopedias", slug: "encyclopedias" },
    ],
  },
  {
    name: "Children's Books",
    slug: "childrens-books",
    color: "#FFB347",
    subcategories: [
      { name: "Picture Books", slug: "picture-books" },
      { name: "Early Readers", slug: "early-readers" },
      { name: "Chapter Books", slug: "chapter-books" },
      { name: "Young Adult", slug: "young-adult" },
    ],
  },
  {
    name: "Science & Technology",
    slug: "science-technology",
    color: "#7EC8E3",
    subcategories: [
      { name: "Computing", slug: "computing" },
      { name: "Engineering", slug: "engineering" },
      { name: "Mathematics", slug: "mathematics" },
      { name: "Nature & Ecology", slug: "nature-ecology" },
    ],
  },
  {
    name: "Health & Fitness",
    slug: "health-fitness",
    color: "#FF9AA2",
    subcategories: [
      { name: "Nutrition", slug: "nutrition" },
      { name: "Exercise & Fitness", slug: "exercise-fitness" },
      { name: "Mental Health", slug: "mental-health" },
      { name: "Wellness", slug: "wellness" },
    ],
  },
  {
    name: "Business & Investing",
    slug: "business-investing",
    color: "#B5B9FF",
    subcategories: [
      { name: "Finance", slug: "finance" },
      { name: "Entrepreneurship", slug: "entrepreneurship" },
      { name: "Management", slug: "management" },
      { name: "Marketing", slug: "marketing" },
    ],
  },
  {
    name: "Arts & Photography",
    slug: "arts-photography",
    color: "#FFCAB0",
    subcategories: [
      { name: "Photography", slug: "photography" },
      { name: "Painting", slug: "painting" },
      { name: "Drawing", slug: "drawing" },
      { name: "Architecture", slug: "architecture" },
    ],
  },
  {
    name: "Cookbooks",
    slug: "cookbooks",
    color: "#FFE066",
    subcategories: [
      { name: "Baking", slug: "baking" },
      { name: "Healthy Cooking", slug: "healthy-cooking" },
      { name: "International Cuisine", slug: "international-cuisine" },
      { name: "Quick & Easy", slug: "quick-easy" },
    ],
  },
  {
    name: "Other",
    slug: "other",
  },
];

const seed = async () => {
  const payload = await getPayload({ config });

  const adminAccount = await stripe.accounts.create({});

  // Create admin tenant
  const adminTenant = await payload.create({
    collection: "tenants",
    data: {
      name: "admin",
      slug: "admin",
      stripeAccountId: adminAccount.id,
    },
  });

  // Create admin user
  await payload.create({
    collection: "users",
    data: {
      email: "admin@demo.com",
      password: "demo",
      roles: ["super-admin"],
      username: "admin",
      tenants: [
        {
          tenant: adminTenant.id,
        },
      ],
    },
  });

  // Create tenant 1
  const tenant1Account = await stripe.accounts.create({});
  const tenant1 = await payload.create({
    collection: "tenants",
    data: {
      name: "tenant1",
      slug: "tenant1",
      stripeAccountId: tenant1Account.id,
    },
  });

  // Create tenant 1 user
  await payload.create({
    collection: "users",
    data: {
      email: "tenant1@demo.com",
      password: "1234567",
      roles: ["user"],
      username: "tenant1",
      tenants: [
        {
          tenant: tenant1.id,
        },
      ],
    },
  });

  // Create tenant 2
  const tenant2Account = await stripe.accounts.create({});
  const tenant2 = await payload.create({
    collection: "tenants",
    data: {
      name: "tenant2",
      slug: "tenant2",
      stripeAccountId: tenant2Account.id,
    },
  });

  // Create tenant 2 user
  await payload.create({
    collection: "users",
    data: {
      email: "tenant2@demo.com",
      password: "1234567",
      roles: ["user"],
      username: "tenant2",
      tenants: [
        {
          tenant: tenant2.id,
        },
      ],
    },
  });

  const createdCategories: Record<string, any> = {};

  for (const category of categories) {
    const parentCategory = await payload.create({
      collection: "categories",
      data: {
        name: category.name,
        slug: category.slug,
        color: category.color,
        parent: null,
      },
    });

    createdCategories[category.slug] = parentCategory;

    for (const subCategory of category.subcategories || []) {
      const subCat = await payload.create({
        collection: "categories",
        data: {
          name: subCategory.name,
          slug: subCategory.slug,
          parent: parentCategory.id,
        },
      });
      createdCategories[subCategory.slug] = subCat;
    }
  }

  // Create 3 books for tenant1 in different categories
  await payload.create({
    collection: "books",
    data: {
      name: "The Name of the Wind",
      author: "Patrick Rothfuss",
      description: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "The riveting first-person narrative of a young man who grows to be the most notorious magician his world has ever seen. From his childhood in a troupe of traveling players, to years spent as a near-feral orphan in a crime-riddled city, to his daringly brazen yet successful bid to enter a legendary school of magic, The Name of the Wind is a masterpiece of telling a story.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      },
      price: 16.99,
      category: createdCategories["fantasy"].id,
      refundPolicy: "30-day",
      tenant: tenant1.id,
      content: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Welcome to the Kingkiller Chronicle series! This digital edition includes bonus materials and author notes.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      },
      isPrivate: false,
      isArchived: false,
    },
  });

  await payload.create({
    collection: "books",
    data: {
      name: "Atomic Habits",
      author: "James Clear",
      description: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      },
      price: 14.99,
      category: createdCategories["self-help"].id,
      refundPolicy: "14-day",
      tenant: tenant1.id,
      content: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "This edition includes additional worksheets, habit tracking templates, and exclusive video content from the author.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      },
      isPrivate: false,
      isArchived: false,
    },
  });

  await payload.create({
    collection: "books",
    data: {
      name: "Clean Code: A Handbook of Agile Software Craftsmanship",
      author: "Robert C. Martin",
      description: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way. This book will show you how to write good code and how to transform bad code into good code.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      },
      price: 39.99,
      category: createdCategories["computing"].id,
      refundPolicy: "30-day",
      tenant: tenant1.id,
      content: {
        root: {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: "normal",
                  style: "",
                  text: "This digital edition includes code examples, exercises, and supplementary materials to help you master clean coding principles.",
                  type: "text",
                  version: 1,
                },
              ],
              direction: "ltr",
              format: "",
              indent: 0,
              type: "paragraph",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "root",
          version: 1,
        },
      },
      isPrivate: false,
      isArchived: false,
    },
  });
};

try {
  await seed();
  console.log("Seeding completed successfully");
  process.exit(0);
} catch (error) {
  console.error("Error during seeding:", error);
  process.exit(1); // Exit with error code
}
