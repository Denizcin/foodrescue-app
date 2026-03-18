import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/shared/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    // TODO: Replace with real OG image (1200x630) before launch
    // images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "FoodRescue" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FoodRescue — Sürpriz Kutuları Keşfet, Tasarruf Et, İsrafı Önle",
    description:
      "İndirimli sürpriz kutularla para biriktir, yerel işletmeleri keşfet ve gıda israfını önle.",
    // TODO: images: ["/og-image.png"],
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
        {/*
          Google Analytics — uncomment to enable.
          1. Set NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX in your environment variables.
          2. Uncomment the two script tags below.
          3. Redeploy.

          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });
              `,
            }}
          />
        */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-50 text-stone-900`}
      >
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
