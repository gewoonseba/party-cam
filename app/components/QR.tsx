"use client";

import { useQRCode } from "next-qrcode";

type QRCodeDisplayProps = {
  path: string;
};

export default function QR({ path }: QRCodeDisplayProps) {
  const { Canvas } = useQRCode();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "localhost:3000";
  const url = `${baseUrl}/${path}`;

  console.log(url);

  return (
    <Canvas
      text={url}
      options={{
        errorCorrectionLevel: "M",
        margin: 4,
        scale: 10,
        width: 120,
        color: {
          dark: "#1a1a1a",
          light: "#00ff95",
        },
      }}
    />
  );
}
