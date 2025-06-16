import { authRouter } from "@/modules/auth/server/procedures";
import { createTRPCRouter } from "../init";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { booksRouter } from "@/modules/books/server/procedures";
import { tagsRouter } from "@/modules/tags/server/procedures";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  tags: tagsRouter,
  books: booksRouter,
  categories: categoriesRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
