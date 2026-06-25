"use client";

import { motion } from "framer-motion";

const quickLinks = ["Menu", "About", "Reviews", "Gallery", "Contact"];

const socials = [
  { name: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { name: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { name: "WhatsApp", href: "https://wa.me/918755597746", icon: WhatsAppIcon },
];

export default function Footer() {
  return (
    <motion.footer
    id="contact"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-[#0F0F0F] px-4 py-16 sm:px-8 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-serif text-xl font-bold tracking-wide text-[#D4AF37] sm:text-2xl">
            SILVER SPOON
          </span>
          <p className="mt-3 text-sm text-white/50">Authentic Multi-Cuisine Dining</p>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {quickLinks.map((link) => (
              <li key={link}>
                <a href="#" className="transition-colors hover:text-[#D4AF37]">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-white">Contact & Address</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>Shop No. 09, Railway Road, Budhanpur Khurd, Dibai, Uttar Pradesh 203393</li>
            <li>
              <a href="tel:08755597746" className="transition-colors hover:text-[#D4AF37]">
                087555 97746
              </a>
            </li>
            <li>Open · Closes 11 PM</li>
            <li>₹200–800 per person</li>
            <li>
              <a
                href="https://maps.google.com/?q=Shop+No.+09,+Railway+Road,+Budhanpur+Khurd,+Dibai,+Uttar+Pradesh+203393"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#D4AF37] transition-colors hover:text-[#F1D878]"
              >
                <MapPinIcon />
                View on Google Maps
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg font-semibold text-white">Follow Us</h4>
          <div className="mt-4 flex gap-4">
            {socials.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#D4AF37]/40 text-[#D4AF37] transition-colors hover:border-[#D4AF37]"
              >
                <Icon />
              </a>
            ))}
          </div>
          <a
            href="#reserve"
            className="mt-6 inline-block rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#0F0F0F] transition-transform hover:scale-105"
          >
            Reserve a Table
          </a>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-[#D4AF37]/20 pt-6">
        <p className="text-center text-xs text-white/40">
          © 2026 Silver Spoon. All rights reserved.
        </p>
      </div>
    </motion.footer>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.5L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z" />
      <path d="M8.5 9.5c0 3.5 2.5 6 6 6" />
    </svg>
  );
}
