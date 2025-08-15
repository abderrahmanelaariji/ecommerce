'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useCartUI } from "@/context/CartUIContext";
import { useCart, type CartItem } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

// Sub-component for displaying a single cart item
const CartItemCard = ({ item }: { item: CartItem }) => {
  const { dispatch } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const handleQuantityChange = (newQuantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId: item.product.id, quantity: newQuantity } });
  };

  const handleRemoveItem = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId: item.product.id } });
  }

  return (
    <div className="flex items-center space-x-4 py-4">
      <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
        <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/products/${item.product.id}`} className="font-medium hover:underline truncate block">
          {item.product.name}
        </Link>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border rounded-md">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity - 1)} aria-label="Decrease quantity">
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.quantity + 1)} aria-label="Increase quantity">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
        </div>
      </div>
       <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500 flex-shrink-0" onClick={handleRemoveItem} aria-label="Remove item">
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  )
}

const CartDrawer = () => {
  const { isCartOpen, toggleCart } = useCartUI();
  const { cartItems, itemCount, totalPrice } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</SheetTitle>
        </SheetHeader>

        {itemCount > 0 ? (
          <>
            <div className="flex-1 overflow-y-auto -mx-6 px-6 divide-y">
              {cartItems.map(item => (
                <CartItemCard key={item.product.id} item={item} />
              ))}
            </div>

            <SheetFooter className="mt-auto bg-background border-t -mx-6 px-6 py-4">
              <div className="w-full space-y-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <SheetClose asChild>
                   <Link href="/checkout" className="w-full">
                    <Button size="lg" className="w-full">Proceed to Checkout</Button>
                  </Link>
                </SheetClose>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <ShoppingCart className="h-16 w-16 text-gray-300" />
            <p className="text-lg font-semibold">Your cart is empty</p>
            <SheetClose asChild>
              <Button>Start Shopping</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
