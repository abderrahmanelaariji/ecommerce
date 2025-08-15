import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl group">
      <Link href={`/products/${product.id}`} className="block aspect-w-1 aspect-h-1 w-full overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-full object-cover object-center group-hover:opacity-75 transition-opacity"
        />
      </Link>
      <div className="p-4 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          <Link href={`/products/${product.id}`} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <div className="flex-grow mt-2">
          <p className="text-gray-600 font-medium">{formatPrice(product.price)}</p>
        </div>
        <div className="mt-4">
          <Button className="w-full">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
