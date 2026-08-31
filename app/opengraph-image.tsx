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
            "linear-gradient(135deg, rgba(114,176,24,0.25) 0%, rgba(0,136,152,0.2) 45%, transparent 70%), radial-gradient(circle at 85% 15%, rgba(251,176,36,0.3), transparent 50%), #0F1F1F",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 44,
            fontWeight: 700,
            color: "#F7FAFC",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "linear-gradient(135deg, #72B018 0%, #008898 100%)",
            }}
          />
          Watt
          <span
            style={{
              background: "linear-gradient(135deg, #72B018 0%, #008898 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Pe
          </span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 64,
            fontWeight: 700,
            color: "#F7FAFC",
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
            color: "rgba(247,250,252,0.7)",
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
