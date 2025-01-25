"use client";

import tailwindConfig from "@/tailwind.config";
import { useQRCode } from "next-qrcode";
import resolveConfig from "tailwindcss/resolveConfig";
import { DefaultColors } from "tailwindcss/types/generated/colors";
import { DefaultTheme } from "tailwindcss/types/generated/default-theme";
// Define the extended theme type
type CustomThemeConfig = {
  theme: {
    colors: {
      primary: string;
      // other custom colors
    } & DefaultColors;
  } & DefaultTheme;
};

const fullConfig = resolveConfig(
  tailwindConfig
) as unknown as CustomThemeConfig;

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
          dark: fullConfig.theme.colors.black,
          light: fullConfig.theme.colors.primary,
        },
      }}
    />
  );
}
