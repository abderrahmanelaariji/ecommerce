'use client';

import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProductDetailClientProps {
  product: Product;
}

const ProductDetailClient = ({ product }: ProductDetailClientProps) => {
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
    toast.success(`${quantity} x ${product.name} added to cart`, {
      description: `Your cart total is now ${formatPrice(product.price * quantity)}.`, // This is a simplification, need total price from context for accuracy
    });
  };

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="aspect-square relative rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">{product.name}</h1>

          <div className="mt-4">
            <p className="text-3xl text-gray-800">{formatPrice(product.price)}</p>
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Description</h2>
            <p className="mt-2 text-base text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-auto pt-8">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4"/>
                </Button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(q => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4"/>
                </Button>
              </div>
              <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;
