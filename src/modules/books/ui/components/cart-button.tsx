import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/modules/checkout/hooks/use-cart";

interface Props {
  tenantSlug: string;
  bookId: string;
}

export const CartButton = ({ tenantSlug, bookId }: Props) => {
  const cart = useCart(tenantSlug);

  return (
    <Button
      variant="elevated"
      className={cn(
        "flex-1 bg-pink-400",
        cart.isBookInCart(bookId) && "bg-white"
      )}
      onClick={() => cart.toggleBook(bookId)}
    >
      {cart.isBookInCart(bookId) ? "Remove from cart" : "Add to cart"}
    </Button>
  );
};
