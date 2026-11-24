import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartProduct = {
  id: string;
  name: string;
  unitPrice: number;
  unit: string;
  option?: string;
};

export type CartItem = CartProduct & { quantity: number };

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: CartProduct, quantity?: number) => void;
  setQuantity: (id: string, option: string | undefined, quantity: number) => void;
  removeItem: (id: string, option?: string) => void;
  clear: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "by-kim-carrinho";

function validCart(value: unknown): value is CartItem[] {
  return Array.isArray(value) && value.every((item) =>
    item && typeof item.id === "string" && typeof item.name === "string" &&
    typeof item.unitPrice === "number" && Number.isFinite(item.unitPrice) && item.unitPrice >= 0 &&
    typeof item.unit === "string" && Number.isInteger(item.quantity) && item.quantity > 0 &&
    (item.option === undefined || typeof item.option === "string")
  );
}

function mergeCartItems(saved: CartItem[], current: CartItem[]) {
  const merged = [...saved];
  current.forEach((item) => {
    const index = merged.findIndex((entry) => entry.id === item.id && entry.option === item.option);
    const existing = merged[index];
    if (existing) merged[index] = { ...existing, quantity: existing.quantity + item.quantity };
    else merged.push(item);
  });
  return merged;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (validCart(parsed)) setItems((current) => mergeCartItems(parsed, current));
      }
    } catch {
      // JSON inválido: mantém apenas itens adicionados nesta sessão.
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }
    catch { /* carrinho continua disponível em memória */ }
  }, [items, loaded]);

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    setItems((current) => {
      const match = current.find((item) => item.id === product.id && item.option === product.option);
      return match
        ? current.map((item) => item === match ? { ...item, quantity: item.quantity + quantity } : item)
        : [...current, { ...product, quantity }];
    });
  }, []);

  const setQuantity = useCallback((id: string, option: string | undefined, quantity: number) => {
    setItems((current) => quantity <= 0
      ? current.filter((item) => !(item.id === id && item.option === option))
      : current.map((item) => item.id === id && item.option === option ? { ...item, quantity } : item));
  }, []);

  const removeItem = useCallback((id: string, option?: string) => {
    setItems((current) => current.filter((item) => !(item.id === id && item.option === option)));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    addItem, setQuantity, removeItem, clear, isOpen, openCart, closeCart,
  }), [items, addItem, setQuantity, removeItem, clear, isOpen, openCart, closeCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart deve ser usado dentro de CartProvider");
  return value;
}
