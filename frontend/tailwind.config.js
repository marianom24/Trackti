const flowbite = require("flowbite-react/tailwind");

module.exports = {
  darkMode: 'class',

  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Ajusta las rutas si es necesario
    flowbite.content(),
  ],
  theme: {
    extend: {
      screens: {
        'sm':{ 'max': '520px' },
        'break':{ 'max': '995px' },
    
      }
    },
  },
  plugins: [
    flowbite.plugin(),
    require('flowbite/plugin')({
      charts: true,
  }),
  ],
};