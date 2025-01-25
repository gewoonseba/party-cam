import type { Config } from "tailwindcss";

// Define custom colors type
type CustomColors = {
  primary: string;
  // add any other custom colors you have
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-picnic)"],
      },
      colors: {
        primary: "#00ff95",
        black: "#1a1a1a",
        gray: "#4a4a4a",
      } as CustomColors,
      dropShadow: {
        glow: "0 0 10px theme(colors.primary)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

declare module "tailwindcss/types/generated/colors" {
  interface Colors extends CustomColors {}
}

export default config;
