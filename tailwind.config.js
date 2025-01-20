/** @type {import('tailwindcss').Config} */
import withMT from "@material-tailwind/html/utils/withMT";
module.exports = withMT({
  content: [
    "./src/**/*.{html,ts,js}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
  prefix: 'tw-',
  corePlugins: { preflight: false },
});