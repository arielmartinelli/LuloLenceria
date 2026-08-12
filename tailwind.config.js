/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#FAF7F5',         // Light Warm Cream / Nude background
          card: '#FFFFFF',       // Clean white card background
          text: '#2D151B',       // Deep Burgundy Charcoal for text
          muted: '#6E5C62',      // Muted soft mauve text
          burgundy: '#7A1C30',   // Main Wine / Bordó accent
          'burgundy-light': '#94233B',
          rose: '#F3E3E5',       // Soft Blush / Powder Pink
          'rose-dark': '#C8A0A6',
          gold: '#C5A059',       // Champagne Gold
          border: '#EFE8E3',     // Subtle border color
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(45, 21, 27, 0.05)',
        'luxury': '0 10px 30px -5px rgba(122, 28, 48, 0.08)',
        'float': '0 10px 25px -5px rgba(37, 211, 102, 0.3)',
      }
    },
  },
  plugins: [],
}
