/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
	"primary": "#933939",
	"black":"#111111",
	"secondary": {
	  100: "#1A1B1D",
	  200: "#1E1E1E",
	  300: "#2A2B2E",
	},
      },
    },
  },
  plugins: [],
}

