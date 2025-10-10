"use client";

import { useState } from "react";
import {
  ShareIcon,
  LinkIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

interface ShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

/**
 * Social sharing buttons component
 * Sprint 10 - SEO & Navigation Unification
 */
export function ShareButtons({ title, url, description }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    text: description || title,
    url,
  };

  const handleShare = async () => {
    // Check if native share is supported
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error occurred
        console.log("Error sharing:", error);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookUrl, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, "_blank", "width=600,height=400");
  };

  const shareOnWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${title} - ${url}`
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-gray-600 font-medium">Compartir:</span>

      {/* Native share button (mobile) */}
      {typeof navigator !== "undefined" && typeof navigator.share !== "undefined" && (
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-pabellon-green-600 text-white rounded-lg hover:bg-pabellon-green-700 transition-colors text-sm font-medium"
        >
          <ShareIcon className="w-4 h-4" />
          Compartir
        </button>
      )}

      {/* Facebook */}
      <button
        onClick={shareOnFacebook}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#166fe5] transition-colors text-sm font-medium"
        aria-label="Compartir en Facebook"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span className="hidden sm:inline">Facebook</span>
      </button>

      {/* Twitter/X */}
      <button
        onClick={shareOnTwitter}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
        aria-label="Compartir en Twitter"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span className="hidden sm:inline">Twitter</span>
      </button>

      {/* WhatsApp */}
      <button
        onClick={shareOnWhatsApp}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#25D366] text-white rounded-lg hover:bg-[#20bd5a] transition-colors text-sm font-medium"
        aria-label="Compartir en WhatsApp"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="hidden sm:inline">WhatsApp</span>
      </button>

      {/* Copy link */}
      <button
        onClick={handleCopyLink}
        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
        aria-label="Copiar enlace"
      >
        {copied ? (
          <>
            <CheckIcon className="w-4 h-4 text-green-600" />
            <span className="text-green-600">Copiado</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Copiar enlace</span>
          </>
        )}
      </button>
    </div>
  );
}
