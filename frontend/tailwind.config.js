export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#729FD9',
        secondary: '#2A5B84',
        tertiary: '#007D5C',
        danger: '#E37169',
        background: '#3D3D3D',
        'background-dark': '#000000',
        'background-accent': '#313846',
        'grey-raised': '#282828',
        'grey-darker': '#333333',
        'grey-base': '#2A5B84',
        'grey-contrast': '#AAAAAA',
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}