import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TenantCart {
  bookIds: string[];
}

interface CartState {
  tenantCarts: Record<string, TenantCart>;
  addBook: (tenantSlug: string, bookId: string) => void;
  removeBook: (tenantSlug: string, bookId: string) => void;
  clearCart: (tenantSlug: string) => void;
  clearAllCarts: () => void;
  getCartByTenant: (tenantSlug: string) => string[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tenantCarts: {},
      addBook: (tenantSlug, bookId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              bookIds: [
                ...(state.tenantCarts[tenantSlug]?.bookIds || []),
                bookId,
              ],
            },
          },
        })),
      removeBook: (tenantSlug, bookId) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              bookIds:
                state.tenantCarts[tenantSlug]?.bookIds.filter(
                  (id) => id !== bookId
                ) || [],
            },
          },
        })),
      clearCart: (tenantSlug) =>
        set((state) => ({
          tenantCarts: {
            ...state.tenantCarts,
            [tenantSlug]: {
              bookIds: [],
            },
          },
        })),

      clearAllCarts: () =>
        set({
          tenantCarts: {},
        }),

      getCartByTenant: (tenantSlug) =>
        get().tenantCarts[tenantSlug]?.bookIds || [],
    }),
    {
      name: "lexi-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
