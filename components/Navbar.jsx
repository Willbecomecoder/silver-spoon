"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Menu", href: "#menu" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <header
      ref={menuRef}
      className="sticky top-0 z-50 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 py-5 sm:px-8 lg:px-16"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="font-serif text-xl font-bold tracking-wide text-[#D4AF37] sm:text-2xl"
        >
          SILVER SPOON
        </a>

        {/* Desktop Menu */}
        <nav className="hidden items-center gap-8 text-base font-medium md:flex">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white/80 transition-all duration-300 hover:text-[#D4AF37]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
          className="relative z-50 flex h-10 w-10 items-center justify-center text-[#D4AF37] md:hidden"
        >
          <HamburgerIcon open={open} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="absolute left-0 right-0 top-full border-t border-[#D4AF37]/20 bg-[#0F0F0F] shadow-xl md:hidden"
          >
            <div className="flex flex-col py-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function HamburgerIcon({ open }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {open ? (
        <>
          <path d="M18 6L6 18" />
          <path d="M6 6L18 18" />
        </>
      ) : (
        <>
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </>
      )}
    </svg>
  );
}