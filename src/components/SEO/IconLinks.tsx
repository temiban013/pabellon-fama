
export function IconLinks() {
  return (
    <>
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
      <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />

      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />

      {/* Theme colors */}
      <meta name="theme-color" content="#0066CC" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="mobile-web-app-capable" content="yes" />
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
