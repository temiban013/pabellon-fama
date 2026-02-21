/**
 * NitainoCredit — Embeddable developer credit footer
 *
 * A self-contained marketing component for Nitaíno Digital that can be
 * inserted at the bottom of any client project to build brand visibility.
 *
 * Aligns with Puerto Rico's 2026 "Yo Te Quiero Puerto Rico" campaign
 * spirit — celebrating cultural pride, identity, and craftsmanship.
 *
 * @usage
 *   // Default (Spanish, full variant)
 *   <NitainoCredit />
 *
 *   // English, compact
 *   <NitainoCredit lang="en" variant="compact" />
 *
 *   // With dark background override
 *   <NitainoCredit theme="dark" />
 *
 * @dependencies Tailwind CSS (any version 3+/4+)
 * @component Server Component (no "use client" needed)
 */

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

type CreditLang = "es" | "en";
type CreditVariant = "full" | "compact" | "minimal";
type CreditTheme = "light" | "dark" | "auto";

interface NitainoCreditProps {
  /** Language for the credit text */
  lang?: CreditLang;
  /** Display variant: full (with tagline), compact, or minimal (logo only) */
  variant?: CreditVariant;
  /** Color theme override. "auto" inherits from parent context */
  theme?: CreditTheme;
  /** Additional CSS classes for the outermost container */
  className?: string;
  /** UTM campaign source identifier for tracking (defaults to hostname) */
  utmSource?: string;
}

// ──────────────────────────────────────────────
// Bilingual content
// ──────────────────────────────────────────────

const CONTENT = {
  es: {
    craftedIn: "Hecho con orgullo en",
    location: "Borikén",
    tagline: "Soluciones digitales con raíces taínas",
    by: "por",
    brandName: "Nitaíno Digital",
    ariaLabel: "Sitio web desarrollado por Nitaíno Digital en Puerto Rico",
    title: "Visita Nitaíno Digital — Desarrollo web profesional desde Puerto Rico",
  },
  en: {
    craftedIn: "Crafted with pride in",
    location: "Puerto Rico",
    tagline: "Digital solutions rooted in heritage",
    by: "by",
    brandName: "Nitaíno Digital",
    ariaLabel: "Website developed by Nitaíno Digital in Puerto Rico",
    title: "Visit Nitaíno Digital — Professional web development from Puerto Rico",
  },
} as const;

// ──────────────────────────────────────────────
// Portfolio URL builder with UTM tracking
// ──────────────────────────────────────────────

function buildPortfolioUrl(utmSource?: string): string {
  const base = "https://www.mariorafaelayala.com";
  const params = new URLSearchParams({
    utm_source: utmSource ?? "client-site",
    utm_medium: "footer-credit",
    utm_campaign: "nitaino-2026",
  });
  return `${base}?${params.toString()}`;
}

// ──────────────────────────────────────────────
// Inline SVG: Stylized coquí + code bracket mark
// A tiny, tasteful logomark that represents:
// - Puerto Rico (coquí frog silhouette)
// - Technology (angle brackets)
// ──────────────────────────────────────────────

function NitainoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Code brackets representing technology */}
      <path
        d="M8 6L3 12L8 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path
        d="M16 6L21 12L16 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Stylized island/heart in center — pride symbol */}
      <path
        d="M12 8C10.5 8 9.5 9 9.5 10.5C9.5 13 12 15.5 12 15.5C12 15.5 14.5 13 14.5 10.5C14.5 9 13.5 8 12 8Z"
        fill="currentColor"
        opacity="0.85"
      />
    </svg>
  );
}

// ──────────────────────────────────────────────
// Puerto Rico flag accent — a thin tricolor line
// Red · White · Blue with lone star feeling
// ──────────────────────────────────────────────

function PRAccent() {
  return (
    <span className="inline-flex items-center gap-0 mx-2" aria-hidden="true">
      <span className="w-3 h-0.5 rounded-full bg-red-500" />
      <span className="w-3 h-0.5 bg-white dark:bg-gray-200" />
      <span className="w-3 h-0.5 rounded-full bg-blue-600" />
    </span>
  );
}

// ──────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────

export function NitainoCredit({
  lang = "es",
  variant = "full",
  theme = "auto",
  className = "",
  utmSource,
}: NitainoCreditProps) {
  const t = CONTENT[lang];
  const href = buildPortfolioUrl(utmSource);

  // Theme class mapping
  const themeClasses: Record<CreditTheme, string> = {
    light: "bg-gray-50 text-gray-600 border-gray-200",
    dark: "bg-gray-950 text-gray-400 border-gray-800",
    auto: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800",
  };

  // ── Minimal variant: just the logomark + brand name ──
  if (variant === "minimal") {
    return (
      <div
        className={`
          flex items-center justify-center py-3
          text-xs tracking-wide
          ${themeClasses[theme]}
          ${className}
        `}
        role="contentinfo"
        aria-label={t.ariaLabel}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"

          className="inline-flex items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity duration-300"
        >
          <NitainoMark className="w-4 h-4" />
          <span className="font-medium">{t.brandName}</span>
        </a>
      </div>
    );
  }

  // ── Compact variant: one-liner with location ──
  if (variant === "compact") {
    return (
      <div
        className={`
          flex items-center justify-center py-3 px-4
          text-xs tracking-wide border-t
          ${themeClasses[theme]}
          ${className}
        `}
        role="contentinfo"
        aria-label={t.ariaLabel}
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"

          className="inline-flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity duration-300"
        >
          <NitainoMark className="w-4 h-4" />
          <span>
            {t.craftedIn}{" "}
            <span className="font-semibold">{t.location}</span>
          </span>
          <PRAccent />
          <span>
            {t.by}{" "}
            <span className="font-semibold">{t.brandName}</span>
          </span>
        </a>
      </div>
    );
  }

  // ── Full variant: two-line with tagline ──
  return (
    <div
      className={`
        border-t py-5 px-4
        ${themeClasses[theme]}
        ${className}
      `}
      role="contentinfo"
      aria-label={t.ariaLabel}
    >
      <div className="group max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs tracking-wide">
        {/* Primary credit line */}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"

          className="inline-flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
        >
          <NitainoMark className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span>
            {t.craftedIn}{" "}
            <span className="font-semibold">{t.location}</span>
          </span>
          <PRAccent />
          <span>
            {t.by}{" "}
            <span className="font-semibold">{t.brandName}</span>
          </span>
        </a>

        {/* Tagline — hidden on very small screens */}
        <span
          className="hidden sm:inline-block text-[10px] opacity-40 group-hover:opacity-100 transition-opacity duration-300 italic"
          aria-hidden="true"
        >
          — {t.tagline}
        </span>
      </div>
    </div>
  );
}

export default NitainoCredit;
