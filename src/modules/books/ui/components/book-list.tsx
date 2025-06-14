"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  category?: string;
}

export const BookList = ({ category }: Props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.books.getMany.queryOptions({
      category,
    })
  );

  return <div>{JSON.stringify(data, null, 2)}</div>;
};

export const BookListSkeleton = () => {
  return <div>Loading...</div>;
};
