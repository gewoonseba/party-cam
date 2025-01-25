"use client";

import { useQRCode } from "next-qrcode";

type QRCodeDisplayProps = {
  url: string;
};

export default function QR({ url }: QRCodeDisplayProps) {
  const { Canvas } = useQRCode();
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
