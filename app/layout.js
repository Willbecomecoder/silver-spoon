import { Playfair_Display, Cormorant_Garamond, Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Silver Spoon | Fine Dining Restaurant",
  description:
    "Silver Spoon offers an unforgettable fine dining experience with seasonal dishes crafted by award-winning chefs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}>
      <body className="bg-[#0F0F0F] font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
