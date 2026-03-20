import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
    "./src/lib/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-geist-mono)", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        brand: {
          ink: "#0f2d22",
          leaf: "#1f5f46",
          mist: "#e8f2ed",
          gold: "#f0d27a",
        },
        surface: {
          base: "#f8f8f6",
          card: "#ffffff",
          subtle: "#f1f4f2",
        },
        text: {
          primary: "#0c1b14",
          secondary: "#39443d",
          muted: "#5f6a63",
        },
        accent: {
          amber: "#f5d77f",
          deep: "#c29a3a",
        },
        border: "var(--border)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "14px",
        md: "10px",
        sm: "8px",
      },
      boxShadow: {
        card: "0 10px 40px rgba(15,45,34,0.06)",
        soft: "0 8px 24px rgba(15,45,34,0.04)",
      },
      backgroundImage: {
        "heritage-texture": "radial-gradient(circle at 20% 20%, rgba(240,210,122,0.28), transparent 45%), radial-gradient(circle at 80% 10%, rgba(240,210,122,0.22), transparent 40%), radial-gradient(circle at 50% 80%, rgba(240,210,122,0.18), transparent 42%)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        underline: {
          "0%": { transform: "scaleX(0)", transformOrigin: "0% 50%" },
          "100%": { transform: "scaleX(1)", transformOrigin: "0% 50%" },
        },
      },
      animation: {
        fadeIn: "fadeIn 320ms ease-out",
        underline: "underline 220ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
