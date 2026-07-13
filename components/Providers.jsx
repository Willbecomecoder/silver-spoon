"use client";

import { SessionProvider } from "next-auth/react";
import CheckoutSystem from "@/components/checkout/CheckoutSystem";
import { CartProvider } from "@/components/checkout/cart-context";

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CheckoutSystem />
      </CartProvider>
    </SessionProvider>
  );
}
