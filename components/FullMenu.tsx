"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import CustomizationModal from "@/components/CustomizationModal";
import { useCart, type CartItem } from "@/components/checkout/cart-context";
import { fullMenuCategories, type FullMenuCategory, type FullMenuItem } from "./full-menu-data";

const allCategoryId = "all";

export default function FullMenu() {
  const [activeCategory, setActiveCategory] = useState(allCategoryId);
  const [searchQuery, setSearchQuery] = useState("");
  const [itemToCustomize, setItemToCustomize] = useState<CartItem | null>(null);
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
                onCustomizeItem={setItemToCustomize}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-white/5 px-5 py-10 text-center">
              <p className="text-sm text-white/60">No menu items found.</p>
            </div>
          )}
        </div>
      </motion.div>
      {itemToCustomize ? (
        <CustomizationModal
          item={itemToCustomize}
          onClose={() => setItemToCustomize(null)}
          onConfirm={(customizedItem) => {
            setItemQuantity(customizedItem, 1);
            setItemToCustomize(null);
          }}
        />
      ) : null}
    </section>
  );
}

function FullMenuCategorySection({
  category,
  getItemQuantity,
  onUpdateQuantity,
  onCustomizeItem,
}: {
  category: FullMenuCategory;
  getItemQuantity: (itemId: string) => number;
  onUpdateQuantity: (
    item: { id: string; name: string; price: number; description?: string },
    nextQuantity: number,
  ) => void;
  onCustomizeItem: (item: CartItem) => void;
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
            hasVariants={Boolean(item.variants?.length)}
            portionType={category.id === "shakes" ? "shake" : null}
            supportsAddOns={category.id === "pizza" || /\b(Burger|Pasta)\b/i.test(item.name)}
            getItemQuantity={getItemQuantity}
            onUpdateQuantity={onUpdateQuantity}
            onCustomizeItem={onCustomizeItem}
          />
        ))}
      </div>
    </motion.div>
  );
}

function FullMenuRow({
  item,
  hasVariants,
  portionType,
  supportsAddOns,
  getItemQuantity,
  onUpdateQuantity,
  onCustomizeItem,
}: {
  item: FullMenuItem;
  hasVariants: boolean;
  portionType: "shake" | null;
  supportsAddOns: boolean;
  getItemQuantity: (itemId: string) => number;
  onUpdateQuantity: (
    item: { id: string; name: string; price: number; description?: string },
    nextQuantity: number,
  ) => void;
  onCustomizeItem: (item: CartItem) => void;
}) {
  const quantity = getItemQuantity(item.id);
  const checkoutItem: CartItem = {
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

      {hasVariants ? (
        <MenuVariantRows
          item={item}
          getItemQuantity={getItemQuantity}
          onUpdateQuantity={onUpdateQuantity}
          onAdd={(variantItem) => (supportsAddOns ? onCustomizeItem(variantItem) : onUpdateQuantity(variantItem, 1))}
        />
      ) : portionType ? (
        <PortionControls
          item={item}
          type={portionType}
          getItemQuantity={getItemQuantity}
          onUpdateQuantity={onUpdateQuantity}
        />
      ) : (
        <div className="flex items-center justify-between gap-3 sm:min-w-[260px] sm:justify-end">
          <span className="shrink-0 text-sm font-semibold text-[#D4AF37] sm:text-base">{item.price ?? ""}</span>
          <QuantityControl
            itemName={item.name}
            quantity={quantity}
            onDecrease={() => onUpdateQuantity(checkoutItem, quantity - 1)}
            onIncrease={() => onUpdateQuantity(checkoutItem, quantity + 1)}
            onAdd={() => (supportsAddOns ? onCustomizeItem(checkoutItem) : onUpdateQuantity(checkoutItem, 1))}
          />
        </div>
      )}
    </div>
  );
}

function PortionControls({
  item,
  type,
  getItemQuantity,
  onUpdateQuantity,
}: {
  item: FullMenuItem;
  type: "shake";
  getItemQuantity: (itemId: string) => number;
  onUpdateQuantity: (item: CartItem, nextQuantity: number) => void;
}) {
  const portions = getShakePortions(item);

  return (
    <div className="flex w-full flex-col gap-2 sm:w-[280px]">
      {portions.map((portion) => {
        const quantity = getItemQuantity(portion.item.id);

        return (
          <div key={portion.item.id} className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-[#D4AF37]">{portion.label}</span>
            <span className="text-sm font-semibold text-[#D4AF37]">{"\u20B9"}{portion.totalPrice}</span>
            <QuantityControl
              itemName={portion.item.name}
              quantity={quantity}
              onDecrease={() => onUpdateQuantity(portion.item, quantity - 1)}
              onIncrease={() => onUpdateQuantity(portion.item, quantity + 1)}
              onAdd={() => onUpdateQuantity(portion.item, 1)}
            />
          </div>
        );
      })}
    </div>
  );
}

function MenuVariantRows({
  item,
  getItemQuantity,
  onUpdateQuantity,
  onAdd,
}: {
  item: FullMenuItem;
  getItemQuantity: (itemId: string) => number;
  onUpdateQuantity: (item: CartItem, nextQuantity: number) => void;
  onAdd: (item: CartItem) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-[280px]">
      {item.variants?.map((variant) => {
        const variantItem: CartItem = {
          id: `${item.id}-${variant.code.toLowerCase()}`,
          itemId: item.id,
          variantCode: variant.code,
          name: `${item.name} (${variant.code})`,
          price: variant.price,
          description: item.description,
        };
        const quantity = getItemQuantity(variantItem.id);

        return (
          <div key={variant.code} className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-[#D4AF37]">{variant.code}</span>
            <span className="text-sm font-semibold text-[#D4AF37]">{"\u20B9"}{variant.price}</span>
            <QuantityControl
              itemName={variantItem.name}
              quantity={quantity}
              onDecrease={() => onUpdateQuantity(variantItem, quantity - 1)}
              onIncrease={() => onUpdateQuantity(variantItem, quantity + 1)}
              onAdd={() => onAdd(variantItem)}
            />
          </div>
        );
      })}
    </div>
  );
}

function getShakePortions(item: FullMenuItem) {
  const regularPrice = getBasePrice(item.price);
  const extraPrice = Number(item.price?.match(/Ice Cream\s*\+\s*\u20B9(\d+)/i)?.[1] ?? 0);

  return [
    {
      label: "Regular",
      totalPrice: regularPrice,
      item: {
        id: `${item.id}-regular`,
        name: `${item.name} (Regular)`,
        price: regularPrice,
        description: item.description,
      },
    },
    {
      label: "With Ice Cream (+\u20B930)",
      totalPrice: regularPrice + extraPrice,
      item: {
        id: `${item.id}-with-ice-cream`,
        name: `${item.name} (With Ice Cream)`,
        price: regularPrice,
        description: item.description,
        addOns: [`Ice Cream (+\u20B9${extraPrice})`],
        addOnTotal: extraPrice,
      },
    },
  ];
}

function getBasePrice(priceLabel?: string) {
  if (!priceLabel) return 0;
  const match = priceLabel.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

function QuantityControl({
  itemName,
  quantity,
  onDecrease,
  onIncrease,
  onAdd,
  addLabel = "+ Add",
}: {
  itemName: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onAdd: () => void;
  addLabel?: string;
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
      {addLabel}
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
