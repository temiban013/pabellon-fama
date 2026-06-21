"use client";

import dynamic from "next/dynamic";

// El editor usa WebGL/window → solo cliente.
const MuseoEditor = dynamic(() => import("./MuseoEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center text-pabellon-green-700">
      Cargando editor…
    </div>
  ),
});

export function MuseoEditorClient() {
  return <MuseoEditor />;
}
