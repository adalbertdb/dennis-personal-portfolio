import { ImageResponse } from "next/og";

export const alt = "Dennis Adalbert · Desarrollador full-stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#000",
          color: "#fff",
          padding: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, letterSpacing: 6, color: "#a3a3a3" }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: "#f5c400" }} />
          ADALBERTDB
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 800, lineHeight: 0.92, letterSpacing: -4 }}>
          <span>DENNIS</span>
          <span>ADALBERT</span>
        </div>
        <div style={{ fontSize: 36, color: "#f5c400", letterSpacing: 4 }}>DESARROLLADOR FULL-STACK</div>
      </div>
    ),
    size,
  );
}
