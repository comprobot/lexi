import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { Category } from "@/payload-types";
import Link from "next/link";

interface Props {
  category: CategoriesGetManyOutput[1];
  isOpen: boolean;
  position: { top: number; left: number };
}

export const SubcategoryMenu = ({ category, isOpen, position }: Props) => {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null;
  }

  const backgroundColor = category.color || "#F5F5F5";
  return (
    <div
      className="absolute z-[100]"
      style={{
        top: "calc(100% + 8px)", // Position below the button with 8px gap
        left: "50%",
        transform: "translateX(-50%)", // Center horizontally
        minWidth: "200px",
      }}
    >
      {/* Invisible bridge to maintain hover */}
      <div className="h-2 w-full" />
      <div
        style={{ backgroundColor }}
        className="w-full text-black rounded-md overflow-hidden border shadow-lg"
      >
        <div className="py-1">
          {category.subcategories?.map((subcategory: Category) => (
            <Link
              key={subcategory.slug}
              href={`/${category.slug}/${subcategory.slug}`}
              className="w-full text-left px-4 py-2 hover:bg-black hover:text-white flex justify-between items-center font-medium block"
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
