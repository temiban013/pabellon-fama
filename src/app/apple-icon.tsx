import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: "linear-gradient(135deg, #0066CC 0%, #004499 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "#FFD700",
          fontWeight: "bold",
          fontFamily: "system-ui",
          borderRadius: 20,
          border: "4px solid #FFD700",
        }}
      >
        <div style={{ fontSize: 72, marginBottom: -10 }}>🏆</div>
        <div style={{ fontSize: 24 }}>PFDH</div>
      </div>
    ),
    {
      ...size,
    }
  );
}
