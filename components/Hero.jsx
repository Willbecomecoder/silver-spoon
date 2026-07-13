"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    name: "Indian Cuisine",
    description:
      "Authentic Indian cuisine featuring rich curries, tandoori delights, and aromatic traditional flavors.",
    image: "/images/kadai-paneer.png",
  },
  {
    id: 2,
    name: "Italian Cuisine",
    description:
      "Classic Italian favorites including handcrafted pizzas, creamy pastas, and cheesy garlic bread.",
    image: "/images/Margherita pizza.png",
  },
  {
    id: 3,
    name: "Chinese Cuisine",
    description:
      "Delicious Indo-Chinese dishes with bold spices, wok-tossed noodles, and flavorful fried rice.",
    image: "/images/Hakka-Noodles.webp",
  },
  {
    id: 4,
    name: "South Indian Cuisine",
    description:
      "Freshly prepared crispy dosas, soft idlis, and authentic South Indian specialties.",
    image: "/images/Masala-Dosa.webp",
  },
];

export default function Hero() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade, Pagination]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      loop
      pagination={{ clickable: true }}
      className="h-[480px] sm:h-[560px] lg:h-[640px] [&_.swiper-pagination]:bottom-6 [&_.swiper-pagination-bullet]:bg-[#D4AF37]/30 [&_.swiper-pagination-bullet]:opacity-100 [&_.swiper-pagination-bullet-active]:bg-[#D4AF37]"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id} className="relative">
          <Image
            src={slide.image}
            alt={slide.name}
            fill
            priority={slide.id === 1}
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/90 via-[#0F0F0F]/50 to-[#0F0F0F]/10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0F0F0F] to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute inset-0 flex flex-col items-start justify-center gap-3 px-4 sm:px-8 lg:px-16"
          >
            <span className="font-script text-2xl italic text-[#D4AF37] sm:text-3xl">
              Welcome to
            </span>

            <h1 className="max-w-xl font-serif text-3xl font-bold text-[#D4AF37] sm:text-4xl lg:text-5xl">
              {slide.name}
            </h1>

            <p className="max-w-md text-sm text-white/80 sm:text-base">
              {slide.description}
            </p>
          </motion.div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
