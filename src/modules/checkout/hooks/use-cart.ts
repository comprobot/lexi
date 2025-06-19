import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
  const { getCartByTenant, addBook, removeBook, clearCart, clearAllCarts } =
    useCartStore();

  const bookIds = getCartByTenant(tenantSlug);

  const toggleBook = (bookId: string) => {
    if (bookIds.includes(bookId)) {
      removeBook(tenantSlug, bookId);
    } else {
      addBook(tenantSlug, bookId);
    }
  };

  const isBookInCart = (bookId: string) => {
    return bookIds.includes(bookId);
  };

  const clearTenantCart = () => {
    clearCart(tenantSlug);
  };

  return {
    bookIds,
    addBook: (bookId: string) => addBook(tenantSlug, bookId),
    removeBook: (bookId: string) => removeBook(tenantSlug, bookId),
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleBook,
    isBookInCart,
    totalItems: bookIds.length,
  };
};
