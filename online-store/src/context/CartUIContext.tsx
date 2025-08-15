'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface CartUIContextType {
  isCartOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

export const CartUIProvider = ({ children }: { children: ReactNode }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <CartUIContext.Provider value={{ isCartOpen, toggleCart, openCart, closeCart }}>
      {children}
    </CartUIContext.Provider>
  );
};

export const useCartUI = () => {
  const context = useContext(CartUIContext);
  if (context === undefined) {
    throw new Error('useCartUI must be used within a CartUIProvider');
  }
  return context;
};
