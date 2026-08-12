'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  size?: string | null;
  color?: string | null;
  model?: string | null;
  quantity: number;
  maxStock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('lulo_cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading cart', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('lulo_cart', JSON.stringify(items));
  }, [items]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = newItem.quantity || 1;
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.variantId === newItem.variantId);
      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const newQty = Math.min(existing.quantity + qtyToAdd, newItem.maxStock);
        const updated = [...prevItems];
        updated[existingIndex] = { ...existing, quantity: newQty };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            ...newItem,
            quantity: Math.min(qtyToAdd, newItem.maxStock),
          },
        ];
      }
    });
    showToast(`"${newItem.name}" agregado al carrito ✓`);
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.variantId === variantId) {
          const validQty = Math.min(quantity, i.maxStock);
          return { ...i, quantity: validQty };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        totalItems,
        isCartOpen,
        setIsCartOpen,
        toastMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
