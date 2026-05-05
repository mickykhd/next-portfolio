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
          background: "linear-gradient(135deg, #0a192f, #112240)",
          borderRadius: "12px",
          color: "#64ffda",
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: -1,
          fontFamily: '"Inter", "Space Grotesk", system-ui',
          border: "2px solid rgba(100, 255, 218, 0.2)",
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