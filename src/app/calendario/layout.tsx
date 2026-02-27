// src/app/calendario/layout.tsx
// Provides metadata for the "use client" calendario page
import { generateMetadata, seoConfigs } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateMetadata(seoConfigs.calendario);

export default function CalendarioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
