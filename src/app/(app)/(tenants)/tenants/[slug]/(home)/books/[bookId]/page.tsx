import { BookView } from "@/modules/books/ui/views/book-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface Props {
  params: Promise<{ bookId: string; slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { bookId, slug } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.tenants.getOne.queryOptions({
      slug,
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BookView bookId={bookId} tenantSlug={slug} />
    </HydrationBoundary>
  );
};

export default Page;
