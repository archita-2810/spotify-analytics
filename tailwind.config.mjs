import { transform } from 'next/dist/build/swc/generated-native';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        blob: "blob 12s infinite ease-in-out",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
            opacity: "0.8",
          },
          "25%": {
            transform: "translate(-100px, 50px) scale(1.2)",
            opacity: "0.7",
          },
          "50%": {
            transform: "translate(100px, -50px) scale(0.9)",
            opacity: "0.6",
          },
          "75%": {
            transform: "translate(-50px, 100px) scale(1.1)",
            opacity: "0.7",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
            opacity: "0.8",
          },
        }
      },
      fontFamily: {
        poppins: ["poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
