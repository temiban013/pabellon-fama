import { Hero } from "@/components/sections/Hero";
import { UltimasNoticias } from "@/components/inicio/UltimasNoticias";
import { QuickLinks } from "@/components/sections/QuickLinks";
import { MuseumShowcase } from "@/components/sections/MuseumShowcase";
import { RegistrationSection } from "@/components/sections/RegistrationSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <UltimasNoticias />
      <QuickLinks />
      <MuseumShowcase />
      <RegistrationSection />
    </>
  );
}
