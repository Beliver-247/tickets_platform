import { ImageResponse } from "next/og";
import { eventConfig } from "@/config/event";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

export const alt = `${eventConfig.eventName} - ${eventConfig.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function assetDataUrl(assetPath: string, type: string) {
  const buffer = await readFile(path.join(process.cwd(), "public", "partners", assetPath));
  return `data:${type};base64,${buffer.toString("base64")}`;
}

export default async function OpenGraphImage() {
  const [baristaLogo, redBullLogo] = await Promise.all([
    assetDataUrl("barista-og.png", "image/png"),
    assetDataUrl("redbull-og.png", "image/png"),
  ]);

  return new ImageResponse(
    <div
      style={{
        background: "#0b0810",
        color: "#f8f4ff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: "72px 84px",
        width: "100%",
      }}
    >
      <div
        style={{
          color: "#ff2bd6",
          display: "flex",
          fontSize: 28,
          fontWeight: 700,
        }}
      >
        {eventConfig.tagline}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            background: "linear-gradient(90deg, #c026ff, #ff2bd6)",
            height: 8,
            width: 150,
          }}
        />
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.05,
          }}
        >
          {eventConfig.eventName}
        </div>
        <div style={{ color: "#b9abc7", display: "flex", fontSize: 30 }}>
          16 November 2026 · {eventConfig.venueName}, {eventConfig.venueAddress}
        </div>
      </div>
      <div
        style={{
          color: "#c026ff",
          display: "flex",
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        Tickets available now
      </div>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 28,
          justifyContent: "flex-end",
        }}
      >
        <img
          alt="Barista"
          src={baristaLogo}
          style={{ height: 48, width: 102 }}
        />
        <img
          alt="Red Bull"
          src={redBullLogo}
          style={{ height: 58, width: 88 }}
        />
      </div>
    </div>,
    size,
  );
}
