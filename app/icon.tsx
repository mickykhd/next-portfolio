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
          background: "linear-gradient(135deg, #050807, #0d1410)",
          borderRadius: "0px",
          color: "#33ff66",
          fontSize: 30,
          fontWeight: 800,
          letterSpacing: 0,
          fontFamily: '"JetBrains Mono", monospace',
          border: "2px solid rgba(51, 255, 102, 0.35)",
        }}
      >
        ~/$
      </div>
    ),
    {
      ...size,
    }
  );
}