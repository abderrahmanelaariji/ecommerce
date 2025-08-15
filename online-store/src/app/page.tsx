'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Product, Category } from '@/types';
import { fetchProducts, fetchCategories } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
        ]);

        setAllProducts(fetchedProducts);
        setCategories(fetchedCategories);
      } catch (e) {
        console.error(e);
        setError("An unexpected error occurred while loading data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter(product => {
        // Category filter
        if (selectedCategories.length === 0) return true;
        return selectedCategories.includes(product.categoryId);
      })
      .filter(product => {
        // Search term filter
        if (searchTerm.trim() === '') return true;
        const searchLower = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        );
      });
  }, [allProducts, searchTerm, selectedCategories]);

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
      {/* Filters Sidebar */}
      <aside className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-24">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Filters</h2>
        <div className="space-y-6 pt-4">
          <div>
            <Label htmlFor="search" className="font-semibold">Search</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Categories</h3>
            <div className="space-y-2">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ) : (
                categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label htmlFor={`category-${category.id}`} className="font-normal cursor-pointer hover:text-primary transition-colors">
                      {category.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Products Grid */}
      <main className="lg:col-span-3">
        <h1 className="text-3xl font-bold mb-8">Products</h1>
        {isLoading ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 col-span-full">
            <h2 className="text-xl font-semibold">No products found</h2>
            <p className="mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}
