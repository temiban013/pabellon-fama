import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MuseoEditorClient } from "@/components/museo/MuseoEditorClient";

// Herramienta interna de desarrollo. Solo se activa cuando NEXT_PUBLIC_MUSEO_EDITOR=1
// está presente en el build; en producción la ruta responde 404. No se indexa.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MuseoEditorPage() {
  if (process.env.NEXT_PUBLIC_MUSEO_EDITOR !== "1") {
    notFound();
  }
  return <MuseoEditorClient />;
}
