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
import { pixelTrack } from '@/lib/meta-pixel';

function parsePriceToRsd(s: string): number {
  const t = s.replace(/\s*RSD\s*$/i, '').replace(/\s*KM\s*$/i, '').trim();
  const n = parseFloat(t.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

const STORAGE_KEY = 'popbeauty-cart';

export type CartLine = {
  slug: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
};

type StoredShape = {
  items: CartLine[];
  /** Kreatorov referral kod (prikazan kao "promo kod" u UI-u) */
  referralCode: string | null;
  referralDiscountPercent: number | null;
};

export type CartLineInput = { slug: string; name: string; price: string; image: string };

type CartContextValue = {
  items: CartLine[];
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (p: CartLineInput) => void;
  /** Tačno po 1 kom oba proizvoda — ostale stavke u korpi ostaju; ova dva slug-a se zamene. */
  addBundlePair: (a: CartLineInput, b: CartLineInput) => void;
  removeLine: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  setReferral: (code: string, discountPercent: number) => void;
  clearReferral: () => void;
  referralCode: string | null;
  referralDiscountPercent: number | null;
};

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_STORED: StoredShape = {
  items: [],
  referralCode: null,
  referralDiscountPercent: null,
};

function parseStored(raw: string | null): StoredShape {
  if (!raw) return EMPTY_STORED;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return { ...EMPTY_STORED, items: parsed as CartLine[] };
    }
    if (parsed && typeof parsed === 'object' && Array.isArray((parsed as StoredShape).items)) {
      const o = parsed as Partial<StoredShape>;
      return {
        items: o.items as CartLine[],
        referralCode: typeof o.referralCode === 'string' ? o.referralCode : null,
        referralDiscountPercent:
          typeof o.referralDiscountPercent === 'number' && Number.isFinite(o.referralDiscountPercent)
            ? o.referralDiscountPercent
            : null,
      };
    }
  } catch {
    /* ignore */
  }
  return EMPTY_STORED;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [referralCode, setReferralCodeState] = useState<string | null>(null);
  const [referralDiscountPercent, setReferralDiscountPercentState] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = parseStored(
      typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null,
    );
    setItems(stored.items);
    setReferralCodeState(stored.referralCode);
    setReferralDiscountPercentState(stored.referralDiscountPercent);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload: StoredShape = { items, referralCode, referralDiscountPercent };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [items, referralCode, referralDiscountPercent, ready]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const addItem = useCallback((p: CartLineInput) => {
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
    pixelTrack('AddToCart', {
      content_ids: [p.slug],
      content_name: p.name,
      content_type: 'product',
      value: parsePriceToRsd(p.price),
      currency: 'RSD',
    });
  }, []);

  const addBundlePair = useCallback((a: CartLineInput, b: CartLineInput) => {
    setItems((prev) => {
      const rest = prev.filter((x) => x.slug !== a.slug && x.slug !== b.slug);
      return [...rest, { ...a, quantity: 1 }, { ...b, quantity: 1 }];
    });
    setIsOpen(true);
    pixelTrack('AddToCart', {
      content_ids: [a.slug, b.slug],
      content_name: `${a.name} + ${b.name}`,
      content_type: 'product',
      value: parsePriceToRsd(a.price) + parsePriceToRsd(b.price),
      currency: 'RSD',
      contents: [
        { id: a.slug, quantity: 1 },
        { id: b.slug, quantity: 1 },
      ],
    });
  }, []);

  const removeLine = useCallback((slug: string) => {
    setItems((prev) => prev.filter((x) => x.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((x) => x.slug !== slug));
      return;
    }
    setItems((prev) => prev.map((x) => (x.slug === slug ? { ...x, quantity } : x)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setReferralCodeState(null);
    setReferralDiscountPercentState(null);
  }, []);

  const setReferral = useCallback((code: string, discountPercent: number) => {
    setReferralCodeState(code);
    setReferralDiscountPercentState(discountPercent);
  }, []);

  const clearReferral = useCallback(() => {
    setReferralCodeState(null);
    setReferralDiscountPercentState(null);
  }, []);

  const itemCount = useMemo(() => items.reduce((s, x) => s + x.quantity, 0), [items]);

  const value = useMemo(
    () => ({
      items, itemCount, isOpen, openCart, closeCart, toggleCart,
      addItem, addBundlePair, removeLine, setQuantity, clearCart,
      setReferral, clearReferral, referralCode, referralDiscountPercent,
    }),
    [
      items, itemCount, isOpen, openCart, closeCart, toggleCart,
      addItem, addBundlePair, removeLine, setQuantity, clearCart,
      setReferral, clearReferral, referralCode, referralDiscountPercent,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart mora biti unutar CartProvider');
  return ctx;
}
