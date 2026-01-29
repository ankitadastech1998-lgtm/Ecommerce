
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, CartItem, Product, Order, Address, PaymentMethod } from '../types';
import { MOCK_PRODUCTS } from '../constants';

interface AppContextType {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (paymentMethod: PaymentMethod, address: Address) => void;
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nova_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('nova_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('nova_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) localStorage.setItem('nova_user', JSON.stringify(user));
    else localStorage.removeItem('nova_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nova_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('nova_orders', JSON.stringify(orders));
  }, [orders]);

  const login = (email: string, name: string) => {
    setUser({ id: Math.random().toString(36).substr(2, 9), name, email, orders: [] });
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const updateUser = (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const createOrder = (paymentMethod: PaymentMethod, address: Address) => {
    const newOrder: Order = {
      id: `ORD-${Math.random().toString(36).toUpperCase().substr(2, 6)}`,
      items: [...cart],
      total: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      status: 'Processing',
      date: new Date().toISOString(),
      paymentMethod,
      address,
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
  };

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppContext.Provider value={{
      user, login, logout, updateUser,
      cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
      orders, createOrder,
      products: filteredProducts,
      searchQuery, setSearchQuery
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
