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

    for (const subCategory of category.subcategories || []) {
      await payload.create({
        collection: "categories",
        data: {
          name: subCategory.name,
          slug: subCategory.slug,
          parent: parentCategory.id,
        },
      });
    }
  }
};

try {
  await seed();
  console.log("Seeding completed successfully");
  process.exit(0);
} catch (error) {
  console.error("Error during seeding:", error);
  process.exit(1); // Exit with error code
}
