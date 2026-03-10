import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#11212d",
        surf: "#f4f7f1",
        field: "#2f6b3b",
        clay: "#c98c5c",
      },
    },
  },
  plugins: [],
};

export default config;
