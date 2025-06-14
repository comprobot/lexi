import {
  BookList,
  BookListSkeleton,
} from "@/modules/books/ui/components/book-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  params: Promise<{
    category: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { category } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.books.getMany.queryOptions({
      category,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<BookListSkeleton />}>
        <BookList category={category} />
      </Suspense>
    </HydrationBoundary>
  );
};

// http://localhost:3000/education

export default Page;
