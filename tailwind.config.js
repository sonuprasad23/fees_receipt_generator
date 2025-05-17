module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: "selector", // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ... (keep existing colors, borderRadius, keyframes, animation)
      boxShadow: { // Example custom shadows
        '3d-green': '5px 5px 0px #22c55e, 10px 10px 0px #16a34a', // Example 3D like shadow
        'inner-strong': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06), inset 0 0 10px rgba(34,197,94,0.5)',
      },
      backgroundImage: { // Example gradients
        'green-black-diag': 'linear-gradient(135deg, #00FF00 0%, #000000 100%)',
      },
      scale: { // For preview scaling
        '025': '0.25',
        '03': '0.3',
        '04': '0.4',
        // Add other scales as needed for preview in FeeStructureForm
      },
      minHeight: { // For A4
        '[297mm]': '297mm',
      },
      width: { // For A4
        '[210mm]': '210mm',
      },
      zIndex: { // Ensure watermark is behind
        '-0': '-0',
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.perspective-1000': {
          'perspective': '1000px',
        },
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
      })
    }
  ],
  // Ensure 'print' variant is enabled for utilities you use with print: prefix
  // For Tailwind CSS v3+, most core plugins have print variant enabled by default for utilities like `display`, `margin`, `padding`, etc.
  // If you find `print:hidden` or other print variants not working, you might need to explicitly enable them for specific utilities here,
  // but it's usually not necessary for common ones.
  // variants: {
  //   extend: {
  //     display: ['print'], // Example if 'print:block' wasn't working
  //   },
  // },
}