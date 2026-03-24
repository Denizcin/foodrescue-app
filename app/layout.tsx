import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/shared/CookieConsent";
import { Suspense } from "react";
import GoogleAnalytics from "@/components/shared/GoogleAnalytics";

// Headings — Plus Jakarta Sans
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Body — Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Monospace — pickup codes, prices in contexts that need tabular clarity
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "FoodRescue — Sürpriz Kutuları Keşfet, Tasarruf Et, İsrafı Önle",
    template: "%s | FoodRescue",
  },
  description:
    "İndirimli sürpriz kutularla para biriktir, yerel işletmeleri keşfet ve gıda israfını önle. Türkiye'nin gıda kurtarma platformu.",
  keywords: [
    "sürpriz kutu",
    "gıda israfı",
    "indirimli yemek",
    "food rescue",
    "yerel işletme",
    "tasarruf",
  ],
  authors: [{ name: "FoodRescue" }],
  creator: "FoodRescue",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://foodrescue.com.tr"
  ),
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "FoodRescue",
    title: "FoodRescue — Sürpriz Kutuları Keşfet, Tasarruf Et, İsrafı Önle",
    description:
      "İndirimli sürpriz kutularla para biriktir, yerel işletmeleri keşfet ve gıda israfını önle.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodRescue — Sürpriz Kutuları Keşfet, Tasarruf Et, İsrafı Önle",
    description:
      "İndirimli sürpriz kutularla para biriktir, yerel işletmeleri keşfet ve gıda israfını önle.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <link rel="apple-touch-icon" href="/globe.svg" />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js').catch(function(){}); }`,
          }}
        />
      </head>
      <body
        className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable} antialiased bg-stone-50 text-stone-900`}
      >
        {children}
        <CookieConsent />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <Suspense fallback={null}>
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          </Suspense>
        )}
      </body>
    </html>
  );
}
