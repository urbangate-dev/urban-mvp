import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)"],
        "roboto-mono": ["var(--font-roboto-mono)"],
        "roboto-condensed": ["var(--font-roboto-condensed)"],
      },
      colors: {
        gold: "#D19B01",
        "dark-gold": "#AC8000",
        "background-black": "#0f0f0f",
        "grey-border": "#262626",
        "grey-text": "#676665",
        "grey-input": "#1a1a1a",
      },
    },
  },

  plugins: [],
});

// const config: Config = {
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ["var(--font-poppins)"],
//       },
//       colors: {
//         gold: "#D19B01",
//         "dark-gold": "#AC8000",
//       },
//     },
//   },

//   plugins: [],
// };
// export default config;
