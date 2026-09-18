import type { Metadata, Viewport } from "next";
import { Caveat, DM_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import "./mini-app.css";

const editorial = Newsreader({ subsets: ["latin"], variable: "--font-editorial", display: "swap" });

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "The Local Food Drop",
  description:
    "Four chefs. Four dishes with a story. Limited local food drops, cooked with care.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${hand.variable} ${editorial.variable}`}>{children}</body>
    </html>
  );
}
