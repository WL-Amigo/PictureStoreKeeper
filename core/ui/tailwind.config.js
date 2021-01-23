const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./public/index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
      },
      backgroundImage: _theme => ({
        'seamless-paper': "url('assets/seamless_paper_texture.png')",
      }),
      zIndex: {
        modal: '200',
      },
    },
  },
  variants: {
    extend: {
      display: ['group-hover'],
    },
  },
  plugins: [],
};
