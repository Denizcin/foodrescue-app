import type { Metadata } from "next";
import NominateBusinessForm from "@/components/consumer/NominateBusinessForm";

export const metadata: Metadata = {
  title: "İşletme Öner",
  description:
    "Sevdiğin bir işletmenin FoodRescue'da yer almasını istiyorsan bize bildir.",
};

export default function NominatePage() {
  return <NominateBusinessForm />;
}
