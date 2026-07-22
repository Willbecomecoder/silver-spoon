"use client";

import { useState } from "react";

import type { CartItem } from "@/components/checkout/cart-context";

const EXTRA_CHEESE = "Extra Cheese (+\u20B930)";
const EXTRA_CHEESE_PRICE = 30;

type CustomizationModalProps = {
  item: CartItem;
  onClose: () => void;
  onConfirm: (item: CartItem) => void;
};

export default function CustomizationModal({ item, onClose, onConfirm }: CustomizationModalProps) {
  const [hasExtraCheese, setHasExtraCheese] = useState(false);

  const addOns = hasExtraCheese ? [EXTRA_CHEESE] : [];
  const customizedItem: CartItem = {
    ...item,
    id: hasExtraCheese ? `${item.id}-extra-cheese` : item.id,
    addOns,
    addOnTotal: hasExtraCheese ? EXTRA_CHEESE_PRICE : 0,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-4 sm:items-center sm:justify-center" role="presentation">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="customization-title"
        className="w-full max-w-md rounded-2xl border border-[#D4AF37]/30 bg-[#171717] p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">Customize</p>
            <h2 id="customization-title" className="mt-1 font-serif text-2xl font-bold text-[#F5F1E8]">
              {item.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close customization"
            className="text-xl text-white/60 transition-colors hover:text-white"
          >
            ×
          </button>
        </div>

        <label className="mt-6 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#D4AF37]/25 bg-white/5 p-4">
          <span>
            <span className="block font-medium text-[#F5F1E8]">Extra Cheese</span>
            <span className="mt-1 block text-sm text-white/55">Add a cheesy finish to your order.</span>
          </span>
          <span className="flex shrink-0 items-center gap-2 text-sm font-semibold text-[#D4AF37]">
            +{"\u20B9"}30
            <input
              type="checkbox"
              checked={hasExtraCheese}
              onChange={(event) => setHasExtraCheese(event.target.checked)}
              aria-label="Add extra cheese for \u20B930"
              className="h-4 w-4 accent-[#D4AF37]"
            />
          </span>
        </label>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 flex-1 rounded-full border border-[#D4AF37]/30 text-sm font-medium text-white/75 transition-colors hover:border-[#D4AF37]/50 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(customizedItem)}
            className="h-11 flex-1 rounded-full bg-[#D4AF37] text-sm font-semibold text-[#0F0F0F] transition-opacity hover:opacity-90"
          >
            Add to cart · {"\u20B9"}{customizedItem.price + customizedItem.addOnTotal}
          </button>
        </div>
      </div>
    </div>
  );
}
