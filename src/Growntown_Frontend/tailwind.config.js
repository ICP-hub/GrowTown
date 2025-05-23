/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        myCustomFont: ["MyCustomFont", "sans-serif"],
        caslonAntique: ["CaslonAntique", "serif"],
        ironman: ['"Iron Man"', 'sans-serif'],
      },
     
      screens: {
        "1.3xl": "1425px", // Custom breakpoint for 1400px
        "1.2xl": "1200px", // Custom breakpoint for 1200px
        "1.5md": "900px",
        'xxs': '321px',
        'md1':'992px'
      },
      animation: {
        spin: "spin 1s linear infinite",
      },
      colors: {
        baseColor: "#202020",
        highlightColor: "#444",
      },
      borderColor: {
        custom: "#202020",
        "t-custom": "#444",
      },
    },
  },
  plugins: [],
};
