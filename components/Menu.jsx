"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useCart } from "@/components/checkout/cart-context";

import "swiper/css";

const categories = [
 {
  name: "Indian Cuisine",
  tagline: "Rich spices, slow-cooked traditions",
  dishes: [
    {
      id: "indian-kadai-paneer",
      name: "Kadai Paneer",
      description: "Paneer cooked in rich kadai masala.",
      price: 220,
      image: "/images/kadai-paneer.png",
    },
    {
      id: "indian-paneer-tikka",
      name: "Paneer Tikka",
      description: "Grilled paneer with Indian spices.",
      price: 280,
      image: "/images/Paneer-Tikka.jpg",
    },
    {
      id: "indian-soya-chaap-biryani",
      name: "Soya Chaap Biryani",
      description: "Aromatic biryani with soya chaap.",
      price: 180,
      image: "/images/soya-chap-biryani.png",
    },
    {
      id: "indian-dal-makhani",
      name: "Dal Makhani",
      description: "Creamy slow-cooked black lentils.",
      price: 140,
      image: "/images/Dal-makhani.jpg",
    },
    {
      id: "indian-butter-paneer-masala",
      name: "Butter Paneer Masala",
      description: "Paneer in creamy butter gravy.",
      price: 220,
      image: "/images/butter-paneer-masala.webp",
    },
    {
      id: "indian-kashmiri-dum-aloo",
      name: "Kashmiri Dum Aloo",
      description: "Baby potatoes in rich gravy.",
      price: 160,
      image: "/images/kashmiri-dum-aloo.png",
    },
  ],
},{
  name: "Italian Cuisine",
  tagline: "Classic recipes, comforting flavors",
  dishes: [
    {
      id: "italian-margherita-pizza",
      name: "Margherita Pizza",
      description: "Classic mozzarella pizza.",
      price: 300,
      image: "/images/Margherita pizza.png",
    },
    {
      id: "italian-cheese-garlic-bread",
      name: "Cheese Garlic Bread",
      description: "Garlic bread with melted cheese.",
      price: 120,
      image: "/images/cheese-garlic-bread.png",
    },
    {
      id: "italian-alfredo-pasta",
      name: "Alfredo Pasta",
      description: "Creamy Alfredo white sauce pasta.",
      price: 200,
      image: "/images/alfredo-pasta.png",
    },
    {
      id: "italian-white-sauce-pasta",
      name: "White Sauce Pasta",
      description: "Creamy white sauce pasta.",
      price: 200,
      image: "/images/white-sauce-pasta.jpg",
    },
    {
      id: "italian-red-sauce-pasta",
      name: "Red Sauce Pasta",
      description: "Penne pasta in tomato sauce.",
      price: 180,
      image: "/images/red-sauce-pasta.jpg",
    },
    {
      id: "italian-cheese-pizza",
      name: "Cheese Pizza",
      description: "Mozzarella cheese pizza.",
      price: 300,
      image: "/images/Cheese-pizza.jpeg",
    },
  ],
},
 {
  name: "Chinese Cuisine",
  tagline: "Bold wok-fired favorites",
  dishes: [
    {
      id: "chinese-veg-hakka-noodles",
      name: "Veg Hakka Noodles",
      description: "Wok tossed vegetable noodles.",
      price: 130,
      image: "/images/Hakka-Noodles.webp",
    },
    {
      id: "chinese-veg-manchurian",
      name: "Veg Manchurian",
      description: "Vegetable balls in gravy.",
      price: 180,
      image: "/images/veg-manchurian.jpg",
    },
    {
      id: "chinese-schezwan-fried-rice",
      name: "Schezwan Fried Rice",
      description: "Spicy Schezwan fried rice.",
      price: 160,
      image: "/images/schezwan-fried-rice.jpg",
    },
    {
      id: "chinese-chilli-paneer",
      name: "Chilli Paneer",
      description: "Paneer tossed in chilli sauce.",
      price: 180,
      image: "/images/chilli-paneer.jpg",
    },
    {
      id: "chinese-chilli-potato",
      name: "Chilli Potato",
      description: "Crispy chilli potato.",
      price: 120,
      image: "/images/chilli-potato.jpg",
    },
    {
      id: "chinese-vegetable-spring-rolls",
      name: "Vegetable Spring Rolls",
      description: "Crispy vegetable spring rolls.",
      price: 110,
      image: "/images/Vegetable-Spring-Rolls.jpg",
    },
    {
      id: "chinese-butter-masala-maggi",
      name: "Butter Masala Maggi",
      description: "Creamy butter masala Maggi.",
      price: 120,
      image: "/images/butter-masala-maggi.png",
    },
  ],
},
{
  name: "South Indian Food",
  tagline: "Crisp, tangy, and full of soul",
  dishes: [
    {
      id: "south-indian-masala-dosa",
      name: "Masala Dosa",
      description: "Crispy dosa with potato filling.",
      price: 120,
      image: "/images/Masala-Dosa.webp",
    },
    {
      id: "south-indian-idli-sambar",
      name: "Idli Sambar",
      description: "Soft idli with sambar.",
      price: 90,
      image: "/images/idli-sambar.jpg",
    },
    {
      id: "south-indian-paneer-masala-dosa",
      name: "Paneer Masala Dosa",
      description: "Paneer stuffed dosa.",
      price: 160,
      image: "/images/paneer-masala-dosa.png",
    },
    {
      id: "south-indian-paneer-uttapam",
      name: "Paneer Uttapam",
      description: "Soft paneer uttapam.",
      price: 180,
      image: "/images/paneer-uttapam.jpg",
    },
    {
      id: "south-indian-schezwan-paneer-dosa",
      name: "Schezwan Paneer Dosa",
      description: "Spicy Schezwan dosa.",
      price: 180,
      image: "/images/schezwan-paneer-dosa.png",
    },
    {
      id: "south-indian-rava-onion-dosa",
      name: "Rava Onion Dosa",
      description: "Crispy onion rava dosa.",
      price: 100,
      image: "/images/rava-onion-dosa.jpg",
    },
  ],
},
  {
  name: "Desserts",
  tagline: "Sweet bites to end on a high",
  dishes: [
    {
      id: "desserts-gulab-jamun",
      name: "Gulab Jamun",
      description: "Soft syrup soaked dumplings.",
      price: 30,
      image: "/images/Gulab-Jamun.webp",
    },
    {
      id: "desserts-rasmalai",
      name: "Rasmalai",
      description: "Creamy saffron dessert.",
      price: 80,
      image: "/images/rasmalai.png",
    },
    {
      id: "desserts-rasgulla",
      name: "Rasgulla",
      description: "Fresh cottage cheese sweet.",
      price: 50,
      image: "/images/Rasgulla.jpg",
    },
    {
      id: "desserts-oreo-milkshake",
      name: "Oreo Milkshake",
      description: "Creamy Oreo shake.",
      price: 110,
      image: "/images/Oreo-Milkshake.jpg",
    },
    {
      id: "desserts-vanilla-strawberry-ice-cream",
      name: "Vanilla & Strawberry Ice Cream",
      description: "Two scoop ice cream.",
      price: 90,
      image: "/images/Vanilla-&-Strawberry-Ice-Cream.jpg",
    },
    {
      id: "desserts-sweet-lassi",
      name: "Sweet Lassi",
      description: "Traditional sweet lassi.",
      price: 80,
      image: "/images/Sweet-lassi.jpg",
    },
  ],
},
{
  name: "Beverages & Shakes",
  tagline: "Refreshing sips for every mood",
  dishes: [
    {
      id: "beverages-hot-milk-tea",
      name: "Hot Milk Tea",
      description: "Fresh Indian milk tea.",
      price: 30,
      image: "/images/hot-milk-tea.png",
    },
    {
      id: "beverages-cold-coffee",
      name: "Cold Coffee",
      description: "Cold coffee with ice cream.",
      price: 90,
      image: "/images/Cold-Coffee.jpg",
    },
    {
      id: "beverages-vanilla-shake",
      name: "Vanilla Shake",
      description: "Creamy vanilla shake.",
      price: 100,
      image: "/images/Vanilla-shake.jpg",
    },
    {
      id: "beverages-strawberry-milkshake",
      name: "Strawberry Milkshake",
      description: "Fresh strawberry shake.",
      price: 100,
      image: "/images/Strawberry-shake.webp",
    },
    {
      id: "beverages-sweet-lassi",
      name: "Sweet Lassi",
      description: "Refreshing yogurt drink.",
      price: 80,
      image: "/images/Sweet-lassi.jpg",
    },
    {
      id: "beverages-mojito",
      name: "Mojito",
      description: "Mint lime cooler.",
      price: 110,
      image: "/images/mojito.jpg",
    },
  ],
},
];

export default function Menu() {
  const { getItemQuantity, setItemQuantity } = useCart();

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
            <CuisineRow
              category={category}
              getItemQuantity={getItemQuantity}
              onUpdateQuantity={setItemQuantity}
            />
            {index < categories.length - 1 && (
              <div className="my-12 h-px bg-[#D4AF37]/20" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CuisineRow({ category, getItemQuantity, onUpdateQuantity }) {
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
        slidesPerView={1.08}
        breakpoints={{
          480: { slidesPerView: 1.2 },
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 2.6 },
          1024: { slidesPerView: 4 },
        }}
        loop
        speed={700}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="mt-6 [&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:h-auto"
      >
        {category.dishes.map((dish) => (
          <SwiperSlide key={dish.id} className="h-auto">
            <DishCard
              dish={dish}
              quantity={getItemQuantity(dish.id)}
              onUpdateQuantity={onUpdateQuantity}
            />
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

function DishCard({ dish, quantity, onUpdateQuantity }) {
  return (
    <div className="group flex h-[320px] min-w-0 flex-col overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-white/5 p-4 sm:h-full">
      <div className="overflow-hidden rounded-xl border-2 border-transparent transition-colors group-hover:border-[#D4AF37]">
        <Image
          src={dish.image}
          alt={dish.name}
          width={320}
          height={240}
          className="h-[256px] w-full rounded-xl object-cover object-center sm:h-48"
        />
      </div>
      <div className="mt-1.5 flex flex-1 flex-col sm:mt-4">
        <h4 className="min-h-[1.5rem] break-words font-semibold leading-6 text-[#F5F1E8] line-clamp-1 sm:min-h-[3rem] sm:line-clamp-2">
          {dish.name}
        </h4>
        <p className="hidden mt-0 min-h-[1.25rem] break-words text-sm leading-5 text-white/50 line-clamp-1 sm:mt-1 sm:block sm:min-h-[2.5rem] sm:line-clamp-2">
          {dish.description}
        </p>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2 pt-0 sm:mt-4 sm:pt-2">
        <span className="shrink-0 text-base font-semibold text-[#D4AF37]">
          {"\u20B9"}
          {dish.price}
        </span>
        {quantity > 0 ? (
          <div className="inline-flex shrink-0 items-center rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10">
            <button
              type="button"
              onClick={() => onUpdateQuantity(dish, quantity - 1)}
              aria-label={`Decrease quantity of ${dish.name}`}
              className="flex h-11 w-11 items-center justify-center text-lg font-semibold text-[#F5F1E8] transition-colors hover:text-[#D4AF37]"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-semibold text-[#F5F1E8]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(dish, quantity + 1)}
              aria-label={`Increase quantity of ${dish.name}`}
              className="flex h-11 w-11 items-center justify-center text-lg font-semibold text-[#F5F1E8] transition-colors hover:text-[#D4AF37]"
            >
              +
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onUpdateQuantity(dish, 1)}
            aria-label={`Add ${dish.name} to cart`}
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/10 px-4 text-sm font-medium text-[#F5F1E8] transition-colors hover:border-[#D4AF37] hover:bg-[#D4AF37]/15"
          >
            + Add
          </button>
        )}
      </div>
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
