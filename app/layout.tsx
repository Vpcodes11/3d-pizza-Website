import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import "./hero.css";

const display = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-display", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "FORNO — Wood-fired simplicity",
  description: "Four classics. One great fire. Explore FORNO's wood-fired pizzas, our story, and a taste of neighbourhood dining.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preload" as="image" href="/assets/pizza-margherita.jpg" /></head><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
