/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'screen-design': '390px',
      },
      height: {
        'screen-design': '844px',
      },
    },
  },
  plugins: [],
}
