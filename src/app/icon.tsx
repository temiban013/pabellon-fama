import { ImageResponse } from "next/og";

// Icono principal de la app (32x32, 16x16)
export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "#0066CC",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFD700",
          fontWeight: "bold",
          fontFamily: "system-ui",
          borderRadius: 8,
        }}
      >
        P
      </div>
    ),
    {
      ...size,
    }
  );
}
