"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const stats = ["Multi-Cuisine", "Dine-in & Takeaway", "₹200–800 per person"];

export default function About() {
  return (
    <section id="about" className="bg-[#0F0F0F] px-4 py-16 sm:px-8 lg:px-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="overflow-hidden rounded-2xl border border-[#D4AF37]/30">
            <Image
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=900&auto=format&fit=crop"
              alt="Silver Spoon restaurant interior"
              width={600}
              height={720}
              className="h-[320px] w-full object-cover sm:h-[420px]"
            />
          </div>
          <div className="absolute -bottom-8 -right-4 h-32 w-32 overflow-hidden rounded-2xl border-2 border-[#D4AF37] shadow-xl shadow-black/40 sm:-right-8 sm:h-40 sm:w-40">
            <Image
              src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=400&auto=format&fit=crop"
              alt="Signature dish"
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-8 sm:mt-0"
        >
          <span className="text-sm font-semibold uppercase tracking-widest text-[#D4AF37]">
            About Us
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-white sm:text-4xl">
            A Taste of Tradition, Served Fresh
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/60 sm:text-base">
            Silver Spoon brings authentic, multi-cuisine flavors to your table with
            ingredients sourced fresh every day. Warm hospitality and thoughtful
            service make every visit feel like home.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {stats.map((stat, index) => (
              <span
                key={stat}
                className={`text-sm font-medium text-white/80 sm:text-base ${
                  index > 0 ? "border-l border-[#D4AF37]/30 pl-8" : ""
                }`}
              >
                {stat}
              </span>
            ))}
          </div>

          <a
            href="#menu"
            className="mt-8 inline-block rounded-full border-2 border-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#D4AF37] transition-transform hover:scale-105"
          >
            Explore Menu
          </a>
        </motion.div>
      </div>
    </section>
  );
}
