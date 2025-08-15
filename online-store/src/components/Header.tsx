'use client';

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartUI } from "@/context/CartUIContext";
import { useCart } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";

const Header = () => {
  const { toggleCart } = useCartUI();
  const { itemCount } = useCart();
  const { itemCount } = useCart();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-700">
          E-Store
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-600 hover:text-gray-800 transition-colors">Home</Link>
          <Link href="/products" className="text-gray-600 hover:text-gray-800 transition-colors">All Products</Link>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart className="h-6 w-6 text-gray-600" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
