import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SolanaProvider } from "@/components/providers/solana-provider";
import "./globals.css";

const outfit = localFont({
  src: [
    {
      path: "../public/fonts/outfit-latin-ext.woff2",
      style: "normal",
    },
    {
      path: "../public/fonts/outfit-latin.woff2",
      style: "normal",
    },
  ],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SolPay — Pay anywhere with stablecoins",
  description:
    "AI-powered crypto-to-QRIS payment bridge. Spend IDRX (Indonesian Rupiah stablecoin) instantly across Indonesia.",
  applicationName: "SolPay",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#000915",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full bg-background text-foreground">
        <SolanaProvider>{children}</SolanaProvider>
      </body>
    </html>
  );
}
