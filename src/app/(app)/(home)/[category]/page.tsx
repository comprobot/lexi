import { BookFilters } from "@/modules/books/ui/components/book-filters";
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
      <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2">
            <BookFilters />
          </div>

          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<BookListSkeleton />}>
              <BookList category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

// http://localhost:3000/education

export default Page;
