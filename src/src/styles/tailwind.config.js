module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        blush: '#F8C8DC',
        lavender: '#E6E6FA',
        babyblue: '#BFEFFF',
        mint: '#C6F6D5',
        cream: '#FFFDD0',
        pastelpurple: '#D6C1E6',
        softpink: '#FADADD',
        peach: '#FFD1BA',
        lilac: '#E9D6EC',
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        quicksand: ["Quicksand", "sans-serif"],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
