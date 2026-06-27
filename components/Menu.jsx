"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const categories = [
 {
  name: "Indian Cuisine",
  tagline: "Rich spices, slow-cooked traditions",
  dishes: [
    {
      name: "Kadai Paneer",
      description:
        "Fresh paneer cubes cooked with capsicum, onions, tomatoes, and authentic kadai spices.",
      image: "/images/kadai-paneer.png",
    },
    {
      name: "Paneer Tikka",
      description:
        "Smoky grilled paneer marinated in yogurt, herbs, and traditional Indian spices.",
      image: "/images/Paneer-Tikka.jpg",
    },
    {
      name: "Soya Chaap Biryani",
      description:
        "Fragrant basmati rice layered with juicy soya chaap and aromatic biryani spices.",
      image: "/images/soya-chap-biryani.png",
    },
    {
      name: "Dal Makhani",
      description:
        "Slow-cooked black lentils simmered in butter, cream, and rich North Indian spices.",
      image: "/images/Dal-makhani.jpg",
    },
    {
      name: "Butter Paneer Masala",
      description:
        "Soft paneer cubes served in creamy butter tomato gravy with rich Indian flavors.",
      image: "/images/butter-paneer-masala.webp",
    },
    {
      name: "Kashmiri Dum Aloo",
      description:
        "Baby potatoes simmered in rich Kashmiri-style gravy infused with authentic spices.",
      image: "/images/kashmiri-dum-aloo.png",
    },
  ],
},{
  name: "Italian Cuisine",
  tagline: "Classic recipes, comforting flavors",
  dishes: [
    {
      name: "Margherita Pizza",
      description:
        "Classic Italian pizza topped with mozzarella cheese, fresh basil, and rich tomato sauce.",
      image: "/images/Margherita pizza.png",
    },
    {
      name: "Cheese Garlic Bread",
      description:
        "Freshly baked garlic bread loaded with melted cheese, butter, herbs, and roasted garlic.",
      image: "/images/cheese-garlic-bread.png",
    },
    {
      name: "Alfredo Pasta",
      description:
        "Creamy Alfredo pasta tossed with parmesan cheese, herbs, and a rich white sauce.",
      image: "/images/alfredo-pasta.png",
    },
    {
      name: "White Sauce Pasta",
      description:
        "Creamy white sauce pasta cooked with vegetables, herbs, and parmesan cheese.",
      image: "/images/white-sauce-pasta.jpg",
    },
    {
      name: "Red Sauce Pasta",
      description:
        "Penne pasta tossed in flavorful tomato sauce with Italian herbs and spices.",
      image: "/images/red-sauce-pasta.jpg",
    },
    {
      name: "Cheese Pizza",
      description:
        "Golden baked pizza loaded with premium mozzarella cheese and rich tomato sauce.",
      image: "/images/Cheese-pizza.jpeg",
    },
  ],
},
 {
  name: "Chinese Cuisine",
  tagline: "Bold wok-fired favorites",
  dishes: [
    {
      name: "Veg Hakka Noodles",
      description:
        "Wok-tossed Hakka noodles loaded with fresh vegetables and authentic Indo-Chinese sauces.",
      image: "/images/Hakka-Noodles.webp",
    },
    {
      name: "Veg Manchurian",
      description:
        "Crispy vegetable balls tossed in spicy Manchurian gravy with spring onions and peppers.",
      image: "/images/veg-manchurian.jpg",
    },
    {
      name: "Schezwan Fried Rice",
      description:
        "Spicy Schezwan fried rice stir-fried with fresh vegetables and bold Chinese flavors.",
      image: "/images/schezwan-fried-rice.jpg",
    },
    {
      name: "Chilli Paneer",
      description:
        "Soft paneer cubes tossed with onions, capsicum, garlic, and spicy Schezwan sauce.",
      image: "/images/chilli-paneer.jpg",
    },
    {
      name: "Chilli Potato",
      description:
        "Crispy potato fingers coated in tangy garlic, chili sauce, and fresh vegetables.",
      image: "/images/chilli-potato.jpg",
    },
    {
      name: "Vegetable Spring Rolls",
      description:
        "Golden crispy spring rolls stuffed with fresh vegetables and served with spicy dip.",
      image: "/images/Vegetable-Spring-Rolls.jpg",
    },
    {
      name: "Butter Masala Maggi",
      description:
        "Creamy butter masala Maggi cooked with aromatic spices for a rich and comforting taste.",
      image: "/images/butter-masala-maggi.png",
    },
  ],
},
{
  name: "South Indian Food",
  tagline: "Crisp, tangy, and full of soul",
  dishes: [
    {
      name: "Masala Dosa",
      description:
        "Golden crispy dosa stuffed with flavorful potato masala, served with coconut chutney and hot sambar.",
      image: "/images/Masala-Dosa.webp",
    },
    {
      name: "Idli Sambar",
      description:
        "Soft steamed idlis served with authentic sambar and fresh coconut chutney.",
      image: "/images/idli-sambar.jpg",
    },
    {
      name: "Paneer Masala Dosa",
      description:
        "Crispy dosa filled with spicy paneer masala and served with traditional chutneys.",
      image: "/images/paneer-masala-dosa.png",
    },
    {
      name: "Paneer Uttapam",
      description:
        "Soft uttapam topped with fresh paneer, onions, tomatoes, and aromatic South Indian spices.",
      image: "/images/paneer-uttapam.jpg",
    },
    {
      name: "Schezwan Paneer Dosa",
      description:
        "Crispy dosa stuffed with spicy Schezwan paneer for a delicious Indo-Chinese fusion.",
      image: "/images/schezwan-paneer-dosa.png",
    },
    {
      name: "Rava Onion Dosa",
      description:
        "Extra crispy rava dosa topped with onions, herbs, and authentic South Indian spices.",
      image: "/images/rava-onion-dosa.jpg",
    },
  ],
},
  {
  name: "Desserts",
  tagline: "Sweet bites to end on a high",
  dishes: [
    {
      name: "Gulab Jamun",
      description:
        "Soft golden milk dumplings soaked in warm sugar syrup for a classic Indian sweet delight.",
      image: "/images/Gulab-Jamun.webp",
    },
    {
      name: "Rasmalai",
      description:
        "Soft cottage cheese dumplings soaked in creamy saffron-flavored milk and topped with pistachios.",
      image: "/images/rasmalai.png",
    },
    {
      name: "Rasgulla",
      description:
        "Fresh, spongy cottage cheese balls soaked in light sugar syrup for a refreshing dessert.",
      image: "/images/Rasgulla.jpg",
    },
    {
      name: "Oreo Milkshake",
      description:
        "Rich and creamy chocolate ice cream made with premium cocoa for every chocolate lover.",
      image: "/images/Oreo-Milkshake.jpg",
    },
    {
      name: "Vanilla & Strawberry Ice Cream",
      description:
        "A delicious combination of creamy vanilla and refreshing strawberry ice cream scoops.",
      image: "/images/Vanilla-&-Strawberry-Ice-Cream.jpg",
    },
    {
      name: "Sweet Lassi",
      description:
        "Traditional chilled yogurt drink blended until smooth for a refreshing and creamy taste.",
      image: "/images/Sweet-lassi.jpg",
    },
  ],
},
{
  name: "Beverages & Shakes",
  tagline: "Refreshing sips for every mood",
  dishes: [
    {
      name: "Hot Milk Tea",
      description:
        "Freshly brewed milk tea prepared with premium tea leaves for a warm and comforting experience.",
      image: "/images/hot-milk-tea.png",
    },
    {
      name: "Cold Coffee",
      description:
        "Smooth chilled coffee blended with fresh milk, ice cream, and topped with creamy foam.",
      image: "/images/Cold-Coffee.jpg",
    },
    {
      name: "Vanilla Shake",
      description:
        "Creamy vanilla milkshake made with premium vanilla ice cream and fresh chilled milk.",
      image: "/images/Vanilla-shake.jpg",
    },
    {
      name: "Strawberry Milkshake",
      description:
        "Rich strawberry milkshake blended with fresh strawberries and creamy ice cream.",
      image: "/images/Strawberry-shake.webp",
    },
    {
      name: "Sweet Lassi",
      description:
        "Traditional Indian sweet lassi blended with fresh yogurt for a smooth and refreshing taste.",
      image: "/images/Sweet-lassi.jpg",
    },
    {
      name: "Mojito",
      description:
        "Refreshing mint and lime cooler served chilled with sparkling soda and crushed ice.",
      image: "/images/mojito.jpg",
    },
  ],
},
];

export default function Menu() {
  return (
    <section id="menu" className="bg-[#0F0F0F] px-4 py-16 sm:px-8 lg:px-16">
      <motion.div
    
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">Our Menu</h2>
        <span className="mx-auto mt-3 block h-1 w-16 rounded-full bg-[#D4AF37]" />
      </motion.div>

      <div className="mx-auto mt-12 max-w-6xl">
        {categories.map((category, index) => (
          <div key={category.name}>
            <CuisineRow category={category} />
            {index < categories.length - 1 && (
              <div className="my-12 h-px bg-[#D4AF37]/20" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CuisineRow({ category }) {
  const swiperRef = useRef(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center">
        <h3 className="font-serif text-2xl font-bold text-[#D4AF37] sm:text-3xl">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-white/50">{category.tagline}</p>
        <div className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
      </div>

      <Swiper
        modules={[Autoplay]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 4 },
        }}
        loop
        speed={700}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="mt-6 [&_.swiper-slide]:h-auto"
      >
        {category.dishes.map((dish) => (
          <SwiperSlide key={dish.name}>
            <DishCard dish={dish} />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6 hidden justify-center gap-4 lg:flex">
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label={`Previous ${category.name} dishes`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#D4AF37] transition-colors hover:border-[#D4AF37]"
        >
          <ArrowIcon direction="left" />
        </button>
        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          aria-label={`Next ${category.name} dishes`}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#D4AF37] transition-colors hover:border-[#D4AF37]"
        >
          <ArrowIcon direction="right" />
        </button>
      </div>
    </motion.div>
  );
}

function DishCard({ dish }) {
  return (
    <div className="group rounded-2xl border border-[#D4AF37]/30 bg-white/5 p-4">
      <div className="overflow-hidden rounded-xl border-2 border-transparent transition-colors group-hover:border-[#D4AF37]">
        <Image
          src={dish.image}
          alt={dish.name}
          width={320}
          height={240}
          className="h-40 w-full object-cover sm:h-48"
        />
      </div>
      <h4 className="mt-4 font-semibold text-[#F5F1E8]">{dish.name}</h4>
      <p className="mt-1 text-sm text-white/50">{dish.description}</p>
    </div>
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
