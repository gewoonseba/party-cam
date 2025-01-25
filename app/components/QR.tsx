"use client";

import { useQRCode } from "next-qrcode";

type QRCodeDisplayProps = {
  path: string;
};

export default function QR({ path }: QRCodeDisplayProps) {
  const { Canvas } = useQRCode();
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "localhost:3000";
  const url = `http://${baseUrl}/${path}`;

  console.log(url);

  return (
    <Canvas
      text={url}
      options={{
        errorCorrectionLevel: "M",
        margin: 2,
        scale: 3,
        width: 200,
        color: {
          dark: "#1a1a1a",
          light: "#00ff95",
        },
      }}
    />
  );
}
