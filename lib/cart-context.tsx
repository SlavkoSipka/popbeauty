'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'popbeauty-cart';

export type CartLine = {
  slug: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (p: { slug: string; name: string; price: string; image: string }) => void;
  removeLine: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const addItem = useCallback(
    (p: { slug: string; name: string; price: string; image: string }) => {
      setItems((prev) => {
        const i = prev.findIndex((x) => x.slug === p.slug);
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], quantity: next[i].quantity + 1 };
          return next;
        }
        return [...prev, { ...p, quantity: 1 }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeLine = useCallback((slug: string) => {
    setItems((prev) => prev.filter((x) => x.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((x) => x.slug !== slug));
      return;
    }
    setItems((prev) =>
      prev.map((x) => (x.slug === slug ? { ...x, quantity } : x))
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((s, x) => s + x.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeLine,
      setQuantity,
      clearCart,
    }),
    [
      items,
      itemCount,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      removeLine,
      setQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart mora biti unutar CartProvider');
  }
  return ctx;
}
