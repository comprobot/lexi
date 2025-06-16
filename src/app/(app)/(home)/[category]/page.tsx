import { BookFilters } from "@/modules/books/ui/components/book-filters";
import {
  BookList,
  BookListSkeleton,
} from "@/modules/books/ui/components/book-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import type { SearchParams } from "nuqs/server";
import { loadBookFilters } from "@/modules/books/search-params";
import { BookSort } from "@/modules/books/ui/components/book-sort";

interface Props {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}

const Page = async ({ params, searchParams }: Props) => {
  const { category } = await params;
  const filters = await loadBookFilters(searchParams);

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.books.getMany.queryOptions({
      category,
      ...filters,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
          <p className="text-2xl font-medium">Curated for you</p>
          <BookSort />
        </div>

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
