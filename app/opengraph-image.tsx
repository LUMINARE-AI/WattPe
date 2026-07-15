import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background:
            "radial-gradient(circle at 80% 20%, rgba(245,165,36,0.35), transparent 55%), #12100D",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 44,
            fontWeight: 700,
            color: "#FBF9F6",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#F5A524",
            }}
          />
          Watt<span style={{ color: "#F5A524" }}>Pe</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 64,
            fontWeight: 700,
            color: "#FBF9F6",
            maxWidth: 900,
          }}
        >
          Solar, beyond rooftops.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 28,
            color: "rgba(251,249,246,0.7)",
            maxWidth: 800,
          }}
        >
          Reserve capacity in a shared solar plant and offset your electricity bills.
        </div>
      </div>
    ),
    { ...size },
  );
}
