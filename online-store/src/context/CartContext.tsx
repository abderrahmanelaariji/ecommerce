'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect, useCallback } from 'react';
import type { Product } from '@/types';

// Define the shape of a cart item
export interface CartItem {
  product: Product;
  quantity: number;
}

// Define the shape of the cart's state
interface CartState {
  cartItems: CartItem[];
}

// Define the actions that can be performed on the cart
type CartAction =
  | { type: 'SET_STATE'; payload: CartState }
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' };

// Define the context value shape
interface CartContextType extends CartState {
  dispatch: React.Dispatch<CartAction>;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingItem = state.cartItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { ...state, cartItems: [...state.cartItems, { product, quantity }] };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        cartItems: state.cartItems.filter(item => item.product.id !== action.payload.productId),
      };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          cartItems: state.cartItems.filter(item => item.product.id !== action.payload.productId),
        };
      }
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, cartItems: [] };
    default:
      return state;
  }
};

const getInitialState = (): CartState => {
  try {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('shoppingCart');
      if (storedCart) {
        return JSON.parse(storedCart);
      }
    }
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
  }
  return { cartItems: [] };
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialState());

  useEffect(() => {
    try {
      localStorage.setItem('shoppingCart', JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [state]);

  const itemCount = state.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ ...state, dispatch, itemCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
