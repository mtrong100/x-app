import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Dark-theme */
        primaryDark: "#272934",
        secondaryDark: "#1f2129",
        darkGraphite: "#17181e",
        darkHover: "#272934",
        darkSaga: "#2f2f2f",

        /* Text-color */
        text_1: "#9195ab",
        text_2: "#4B5264",
        text_3: "#808191",
        text_4: "#B2B3BD",

        /* White-theme */
        cloudGray: "#dadde1",
        whiteSoft: "#FCFBFF",
        graySoft: "#FCFCFC",
        cream: "#f3f3f3",

        /* Bonus-color */
        midnightBlue: "#11142D",

        /* Main-color */
        primaryColor: "#475BE8",
        saga: "#86d46b",
        sapphirePurple: "#7856ff",
        magentaPink: "#f91880",
        skyBlue: "#1d9bf0",
        goldenYellow: "#ffd400",
        amberOrange: "#e66e00",
        mintGreen: "#00ba7c",
      },
      backgroundImage: {
        primaryGradient: "linear-gradient(to right, #17181e, #1f2129)",
        // primaryGradient: "linear-gradient(to left, #159957, #155799)",
      },
      boxShadow: {
        blurPrimary: "0px 0px 8px 8px rgba(71, 91, 232, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
