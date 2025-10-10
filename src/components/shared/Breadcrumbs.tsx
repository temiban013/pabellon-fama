import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  variant?: "light" | "dark"; // light = white text for dark backgrounds, dark = dark text for light backgrounds
}

/**
 * Breadcrumb navigation component
 * Sprint 10 - SEO & Navigation Unification
 * Enhanced with context-aware color variants
 */
export function Breadcrumbs({ items, variant = "light" }: BreadcrumbsProps) {
  // Define color classes based on variant
  const colors = {
    light: {
      link: "text-white/90 hover:text-white",
      current: "text-white/70 font-medium",
      chevron: "text-white/50",
      icon: "text-white/90",
    },
    dark: {
      link: "text-pabellon-green-700 hover:text-pabellon-green-900",
      current: "text-gray-700 font-medium",
      chevron: "text-gray-400",
      icon: "text-pabellon-green-700",
    },
  };

  const colorScheme = colors[variant];

  return (
    <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
      <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
        {/* Home */}
        <li>
          <Link
            href="/"
            className={`${colorScheme.link} transition-colors flex items-center`}
          >
            <HomeIcon className={`w-4 h-4 ${colorScheme.icon}`} />
            <span className="sr-only">Inicio</span>
          </Link>
        </li>

        {/* Breadcrumb items */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              <ChevronRightIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${colorScheme.chevron} mx-1`} />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={`${colorScheme.link} transition-colors truncate max-w-[150px] sm:max-w-none`}
                >
                  {item.label}
                </Link>
              ) : (
                <span className={`${colorScheme.current} truncate max-w-[150px] sm:max-w-none`}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
