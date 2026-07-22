"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  itemId?: string;
  variantCode?: string;
  name: string;
  price: number;
  description?: string;
  addOns?: string[];
  addOnTotal?: number;
};

export type OrderType = "delivery" | "pickup";

export type PaymentMethod = "upi" | "cod" | "restaurant";

export type OrderStatus = "Pending";

export type CustomerDetails = {
  fullName: string;
  mobileNumber: string;
  orderType: OrderType;
  address: string;
  notes: string;
};

export type SavedOrder = {
  id: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: Array<CartItem & { quantity: number; subtotal: number }>;
  customer: CustomerDetails;
  total: number;
  createdAt: string;
};

type CartEntry = CartItem & {
  quantity: number;
  subtotal: number;
};

type CartContextValue = {
  items: CartEntry[];
  itemCount: number;
  total: number;
  getItemQuantity: (itemId: string) => number;
  setItemQuantity: (item: CartItem, quantity: number) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "silver-spoon-cart";
export const ORDER_STORAGE_KEY = "silver-spoon-orders";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Record<string, CartEntry>>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);

    if (!stored) {
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Record<string, CartEntry>;
      setEntries(parsed);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(entries));
  }, [entries, isHydrated]);

  const value = useMemo<CartContextValue>(() => {
    const items = Object.values(entries).sort((left, right) => left.name.localeCompare(right.name));
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    const setItemQuantity = (item: CartItem, quantity: number) => {
      setEntries((current) => {
        if (quantity <= 0) {
          const next = { ...current };
          delete next[item.id];
          return next;
        }

        return {
          ...current,
          [item.id]: {
            ...item,
            quantity,
            subtotal: (item.price + (item.addOnTotal ?? 0)) * quantity,
          },
        };
      });
    };

    return {
      items,
      itemCount,
      total,
      getItemQuantity: (itemId: string) => entries[itemId]?.quantity ?? 0,
      setItemQuantity,
      clearCart: () => setEntries({}),
    };
  }, [entries]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}

export function saveOrder(order: SavedOrder) {
  const stored = window.localStorage.getItem(ORDER_STORAGE_KEY);

  try {
    const orders = stored ? (JSON.parse(stored) as SavedOrder[]) : [];
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify([order, ...orders]));
  } catch {
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify([order]));
  }
}

export function formatCurrency(value: number) {
  return `\u20B9${value}`;
}

export function getPaymentMethodLabel(method: PaymentMethod) {
  if (method === "upi") {
    return "QR Code Payment (UPI)";
  }

  if (method === "cod") {
    return "Cash on Delivery";
  }

  return "Pay at Restaurant";
}
