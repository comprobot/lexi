"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useBookFilters } from "../../hooks/use-book-filters";

interface Props {
  category?: string;
}

export const BookList = ({ category }: Props) => {
  const [filters] = useBookFilters();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.books.getMany.queryOptions({
      category,
      ...filters,
    })
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {data?.docs.map((book) => (
        <div key={book.id} className="border rounded-md bg-white p-4">
          <h2 className="text-xl font-medium">{book.name}</h2>
          <p>${book.price}</p>
        </div>
      ))}
    </div>
  );
};

export const BookListSkeleton = () => {
  return <div>Loading...</div>;
};
