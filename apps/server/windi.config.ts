import { defineConfig } from 'windicss/helpers';
import plugin from 'windicss/plugin';
import Colors from 'windicss/colors';

export default defineConfig({
  darkMode: false, // or 'media' or 'class'
  extract: {
    include: ['./index.html', './**/*.{ts,tsx}', '../../../core/ui/src/**/*.{vue,ts,tsx}'],
    // exclude: ['node_modules/**/*']
  },
  theme: {
    extend: {
      colors: {
        primary: Colors.blue,
      },
      backgroundImage: () => ({
        'seamless-paper': "url('/static/images/seamless_paper_texture.png')",
      }),
      zIndex: {
        modal: '200',
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.touch-none': {
          touchAction: 'none',
        },
      });
    }),
  ],
});
