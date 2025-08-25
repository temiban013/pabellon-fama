
export function IconLinks() {
  return (
    <>
      {/* Favicon básico */}
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

      {/* Apple Touch Icons - usar solo el básico por ahora */}
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

      {/* Theme colors */}
      <meta name="theme-color" content="#0066CC" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="PFDH" />

      {/* Windows */}
      <meta name="application-name" content="Pabellón de la Fama" />
      <meta
        name="msapplication-tooltip"
        content="Pabellón de la Fama del Deporte Humacaeño"
      />
    </>
  );
}
