import { Hero } from "@/components/sections/Hero";
import { QuickLinks } from "@/components/sections/QuickLinks";
import { MuseumShowcase } from "@/components/sections/MuseumShowcase";
import { RegistrationSection } from "@/components/sections/RegistrationSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <QuickLinks />
      <MuseumShowcase />
      <RegistrationSection />
    </>
  );
}
