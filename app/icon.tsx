import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #030014 15%, #5bc6ff 55%, #ff9cf5 100%)",
          borderRadius: "32%",
          color: "#f4f6ff",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: -1,
          fontFamily: '"Syne", "Sora", system-ui',
          textShadow: "0 4px 12px rgba(0,0,0,0.35)",
        }}
      >
        AB
      </div>
    ),
    {
      ...size,
    }
  );
}
