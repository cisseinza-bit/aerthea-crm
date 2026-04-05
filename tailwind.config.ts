import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Backgrounds
    "bg-[#0A0A0A]", "bg-[#111]", "bg-[#111111]", "bg-[#1A1A1A]", "bg-[#2A2A2A]",
    "bg-[#F5F5F5]", "bg-[#D8FF57]", "bg-[#E8630A]",
    "bg-[#D8FF57]/10", "bg-[#D8FF57]/20",
    "bg-[#E8630A]/10", "bg-[#E8630A]/20",
    "bg-[#22C55E]/10", "bg-[#60A5FA]/20",
    "bg-red-500/20",
    // Text
    "text-[#0A0A0A]", "text-[#888888]", "text-[#444444]",
    "text-[#F5F5F5]", "text-[#D8FF57]", "text-[#E8630A]",
    "text-[#22C55E]", "text-[#60A5FA]", "text-[#9CA3AF]",
    "text-red-400",
    // Borders
    "border-[#2A2A2A]", "border-[#D8FF57]", "border-[#E5E5E5]",
    // Hover
    "hover:border-[#D8FF57]", "hover:text-[#D8FF57]",
    "hover:text-[#F5F5F5]", "hover:bg-[#1A1A1A]",
    "hover:bg-[#c2e84d]",
    // Focus
    "focus:border-[#D8FF57]",
    // Group hover
    "group-hover:border-[#D8FF57]",
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
