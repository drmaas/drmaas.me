import { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import daisyui from "daisyui";

const config: Config = {
  content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      keyframes: {
        jump: {
          "0%, 50%": {
            transform: "translateY(0%)",
            "animation-timing-function": "ease-in",
          },
          "25%": {
            transform: "translateY(-25%)",
            "animation-timing-function": "ease-out",
          },
        },
      },
      backgroundImage: {
        "gradient-orange": "linear-gradient(to right, #f97316, #e11d48)",
      },
      fontFamily: {
        mono: [
          "'Fira Code'",
          "'JetBrains Mono'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
      },
    },
  },
  plugins: [typography, daisyui],
  darkMode: ["class", '[data-theme="night"]'],
};

export default config;
