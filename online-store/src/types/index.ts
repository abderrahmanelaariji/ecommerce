export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  total: number;
  orderDate: string;
}
