import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import type { SearchParams } from "nuqs/server";
import { loadBookFilters } from "@/modules/books/search-params";
import { BookListView } from "@/modules/books/ui/views/book-list-view";

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
      <BookListView category={category} />
    </HydrationBoundary>
  );
};

// http://localhost:3000/education

export default Page;
