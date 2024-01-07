/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {

    fontSize: {
      md : "1.6rem",
      lg : ["4.8rem", 1],
    },


    screens:{
      's': {'min': '650px'},
      'l':{'min': '1024px'},
      ...defaultTheme.screens,
      },

    extend: {
      fontFamily: {
        
      },
      colors: {

      },
      spacing:{
        0: "0",
        1: "0.4rem",
        2: "0.8rem",
        3: "1.2rem",
        4: "1.6rem",
        5: "0.5rem",
        6: "2.4rem",
        7: "2.8rem",
        8: "3.2rem",
        9: "3.6rem",
        10: "4rem",
        11: "4.4rem",
        12: "4.8rem",
        40: "4rem"
      },

    },
  },
  plugins:  [
    ]
}
