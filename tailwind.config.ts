import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black:  "#0A0A0A",
        grey:   "#1A1A1A",
        border: "#2A2A2A",
        muted:  "#888888",
        white:  "#F5F5F5",
        accent: "#D8FF57",
      },
    },
  },
  plugins: [],
};
export default config;
