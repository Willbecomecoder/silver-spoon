"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { useCart } from "@/components/checkout/cart-context";
import { fullMenuCategories, type FullMenuCategory, type FullMenuItem } from "./full-menu-data";

const allCategoryId = "all";

export default function FullMenu() {
  const [activeCategory, setActiveCategory] = useState(allCategoryId);
  const [searchQuery, setSearchQuery] = useState("");
  const { getItemQuantity, setItemQuantity } = useCart();

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visibleCategories = fullMenuCategories
    .map((category) => {
      const matchesCategory = activeCategory === allCategoryId || category.id === activeCategory;
      const items = category.items.filter((item) => {
        if (!normalizedQuery) {
          return matchesCategory;
        }

        const haystack = `${item.name} ${item.description ?? ""} ${category.name}`.toLowerCase();
        return matchesCategory && haystack.includes(normalizedQuery);
      });

      return {
        ...category,
        items,
      };
    })
    .filter((category) => category.items.length > 0);

  const hasResults = visibleCategories.length > 0;

  return (
    <section id="full-menu" className="bg-[#0F0F0F] px-4 py-16 sm:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Full Menu</h2>
        <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-[#D4AF37]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mx-auto mt-10 max-w-6xl"
      >
        <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <label className="sr-only" htmlFor="full-menu-search">
              Search menu
            </label>
            <input
              id="full-menu-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search menu..."
              className="h-12 w-full min-w-0 rounded-full border border-[#D4AF37]/30 bg-transparent px-4 sm:px-5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#D4AF37]"
            />

            <div className="-mx-1 overflow-x-auto pb-1">
              <div className="flex min-w-max gap-3 px-1">
                <CategoryButton
                  isActive={activeCategory === allCategoryId}
                  label="All"
                  onClick={() => setActiveCategory(allCategoryId)}
                />
                {fullMenuCategories.map((category) => (
                  <CategoryButton
                    key={category.id}
                    isActive={activeCategory === category.id}
                    label={category.name}
                    onClick={() => setActiveCategory(category.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-10">
          {hasResults ? (
            visibleCategories.map((category) => (
              <FullMenuCategorySection
                key={category.id}
                category={category}
                getItemQuantity={getItemQuantity}
                onUpdateQuantity={setItemQuantity}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 px-5 py-10 text-center">
              <p className="text-sm text-white/60">No menu items found.</p>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}

function FullMenuCategorySection({
  category,
  getItemQuantity,
  onUpdateQuantity,
}: {
  category: FullMenuCategory;
  getItemQuantity: (itemId: string) => number;
  onUpdateQuantity: (
    item: { id: string; name: string; price: number; description?: string },
    nextQuantity: number,
  ) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 p-5 sm:p-6"
    >
      <div className="text-center">
        <h3 className="font-serif text-2xl font-bold text-[#D4AF37] sm:text-3xl">{category.name}</h3>
        <div className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      </div>

      <div className="mt-6 divide-y divide-[#D4AF37]/10">
        {category.items.map((item) => (
          <FullMenuRow
            key={item.id}
            item={item}
            quantity={getItemQuantity(item.id)}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </div>
    </motion.div>
  );
}

function FullMenuRow({
  item,
  quantity,
  onUpdateQuantity,
}: {
  item: FullMenuItem;
  quantity: number;
  onUpdateQuantity: (
    item: { id: string; name: string; price: number; description?: string },
    nextQuantity: number,
  ) => void;
}) {
  const checkoutItem = {
    id: item.id,
    name: item.name,
    price: getBasePrice(item.price),
    description: item.description,
  };

  return (
    <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h4 className="break-words text-base font-semibold text-[#F5F1E8]">{item.name}</h4>
        {item.description ? <p className="mt-1 text-sm text-white/50">{item.description}</p> : null}
      </div>

      <div className="flex items-center justify-between gap-3 sm:min-w-[260px] sm:justify-end">
        <span className="shrink-0 text-sm font-semibold text-[#D4AF37] sm:text-base">{item.price}</span>
        <QuantityControl
          itemName={item.name}
          quantity={quantity}
          onDecrease={() => onUpdateQuantity(checkoutItem, quantity - 1)}
          onIncrease={() => onUpdateQuantity(checkoutItem, quantity + 1)}
          onAdd={() => onUpdateQuantity(checkoutItem, 1)}
        />
      </div>
    </div>
  );
}

function getBasePrice(priceLabel: string) {
  const match = priceLabel.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function QuantityControl({
  itemName,
  quantity,
  onDecrease,
  onIncrease,
  onAdd,
}: {
  itemName: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onAdd: () => void;
}) {
  if (quantity > 0) {
    return (
      <div className="inline-flex shrink-0 items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
        <button
          type="button"
          onClick={onDecrease}
          aria-label={`Decrease quantity of ${itemName}`}
          className="flex h-11 w-11 items-center justify-center text-lg font-semibold text-[#F5F1E8] transition-colors hover:text-[#D4AF37]"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-semibold text-[#F5F1E8]">{quantity}</span>
        <button
          type="button"
          onClick={onIncrease}
          aria-label={`Increase quantity of ${itemName}`}
          className="flex h-11 w-11 items-center justify-center text-lg font-semibold text-[#F5F1E8] transition-colors hover:text-[#D4AF37]"
        >
          +
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={`Add ${itemName} to cart`}
      className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-4 text-sm font-medium text-[#F5F1E8] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/15"
    >
      + Add
    </button>
  );
}

function CategoryButton({
  isActive,
  label,
  onClick,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center justify-center rounded-full border px-4 text-sm whitespace-nowrap transition-colors ${
        isActive
          ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#F5F1E8]"
          : "border-[#D4AF37]/30 bg-transparent text-white/70 hover:border-[#D4AF37]/50 hover:text-[#F5F1E8]"
      }`}
    >
      {label}
    </button>
  );
}
