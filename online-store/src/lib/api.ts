import type { Product, Category, Order, CartItem } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export async function fetchProducts(): Promise<Product[]> {
  try {
    // Using { cache: 'no-store' } to ensure fresh data on every request,
    // which is useful for development with a mock API.
    const response = await fetch(`${API_BASE_URL}/products`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    // In a real app, you'd want more robust error handling.
    // For this project, returning an empty array is sufficient.
    return [];
  }
}

// The data sent to the API will not have an id or orderDate yet
type OrderPayload = {
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  total: number;
}

export async function createOrder(orderData: OrderPayload): Promise<Order> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...orderData, orderDate: new Date().toISOString() }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error('Failed to create order. Please try again.');
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, { cache: 'no-store' });
    if (!response.ok) {
      // If the product is not found, the API returns a 404.
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
