import { fetchProductById } from '@/lib/api';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

// This function generates dynamic metadata for the page (e.g., the title in the browser tab)
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const productId = parseInt(params.productId, 10);

  if (isNaN(productId)) {
    return { title: 'Invalid Product' };
  }

  const product = await fetchProductById(productId);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} - E-Store`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = parseInt(params.productId, 10);

  // Basic validation
  if (isNaN(productId)) {
    notFound();
  }

  const product = await fetchProductById(productId);

  // If no product is found for the ID, render the 404 page
  if (!product) {
    notFound();
  }

  // Pass the fetched product data to a Client Component for interactive elements
  return <ProductDetailClient product={product} />;
}
