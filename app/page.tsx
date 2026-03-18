import type { Metadata } from "next";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import WhySection from "@/components/landing/WhySection";
import ProductExamples from "@/components/landing/ProductExamples";
import AppDownloadCTA from "@/components/landing/AppDownloadCTA";
import Footer from "@/components/shared/Footer";

export const metadata: Metadata = {
  title: "FoodRescue — Sürpriz Kutuları Keşfet, Tasarruf Et, İsrafı Önle",
  description:
    "Türkiye'nin gıda kurtarma platformu. İndirimli sürpriz kutularla hem tasarruf et hem de gıda israfını önle.",
  openGraph: {
    url: "/",
  },
};

export default function LandingPage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <HowItWorks />
      <WhySection />
      <ProductExamples />
      <AppDownloadCTA />
      <Footer />
    </main>
  );
}
