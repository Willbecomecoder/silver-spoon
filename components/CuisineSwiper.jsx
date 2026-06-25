"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const cuisines = [
 {
  id: 1,
  name: "Indian",
  description: "Authentic Indian cuisine featuring rich curries, tandoori delights, and aromatic traditional flavors.",
  image: "/images/kadai-paneer.png",
},
{
  id: 2,
  name: "Italian",
  description: "Classic Italian favorites including handcrafted pizzas, creamy pastas, and cheesy garlic bread.",
  image: "/images/Margherita pizza.png",
},
{
  id: 3,
  name: "Chinese",
  description: "Delicious Indo-Chinese dishes with bold spices, wok-tossed noodles, and flavorful fried rice.",
  image: "/images/Hakka-Noodles.webp",
},
{
  id: 4,
  name: "South Indian",
  description: "Freshly prepared crispy dosas, soft idlis, and authentic South Indian specialties.",
  image: "/images/Masala-Dosa.webp",
},
];

export default function CuisineSwiper() {
  const [index, setIndex] = useState(0);

  const goPrev = () => setIndex((prev) => (prev - 1 + cuisines.length) % cuisines.length);
  const goNext = () => setIndex((prev) => (prev + 1) % cuisines.length);

  const current = cuisines[index];

  return (
    <section className="px-4 py-10 sm:px-8 lg:px-16">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-[#8B5E3C] px-6 py-12 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
        <div className="relative flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous cuisine"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#D4AF37] text-[#D4AF37] transition-transform duration-300 hover:scale-110"
          >
            <ArrowIcon direction="left" />
          </button>

          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-[#F5E6D3] p-8 shadow-xl shadow-black/20 sm:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left"
              >
                <Image
                  src={current.image}
                  alt={current.name}
                  width={320}
                  height={320}
                  className="h-64 w-64 rounded-lg object-cover sm:h-80 sm:w-80"
                />
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-[#1A1A1A] sm:text-3xl">
                    {current.name}
                  </h3>
                  <p className="mt-3 text-[#1A1A1A]/70">{current.description}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next cuisine"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-[#D4AF37] text-[#D4AF37] transition-transform duration-300 hover:scale-110"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>

        <div className="absolute bottom-4 left-0 flex w-full items-center justify-center gap-2">
          {cuisines.map((cuisine, i) => (
            <button
              key={cuisine.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to ${cuisine.name}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-[#D4AF37]" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArrowIcon({ direction }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={direction === "left" ? "-translate-x-px" : "translate-x-px"}
    >
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  );
}
