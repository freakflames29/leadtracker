/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#0F1117',
          secondary: '#1A1D27',
          elevated: '#22263A',
        },
        border: {
          subtle: '#2E3247',
          default: '#3D4263',
        },
        text: {
          primary: '#F0F2FF',
          secondary: '#8B90B0',
          disabled: '#4A506B',
        },
        brand: {
          primary: '#5B7FFF',
          hover: '#4A6EEE',
          subtle: '#1E2A55',
        },
        semantic: {
          success: { DEFAULT: '#34D399', bg: '#0D2A1F' },
          warning: { DEFAULT: '#FBBF24', bg: '#2A2010' },
          error: { DEFAULT: '#F87171', bg: '#2A1111' },
          info: { DEFAULT: '#60A5FA', bg: '#111D2A' },
        },
        lead: {
          hot: { accent: '#FF5B5B', bg: '#2A1515', badge: '#FF8080' },
          warm: { accent: '#FFB347', bg: '#2A2010', badge: '#FFD080' },
          cold: { accent: '#5BA8FF', bg: '#111E2A', badge: '#80C4FF' },
          other: { accent: '#A78BFA', bg: '#1E1A2A', badge: '#C4B0FF' },
        }
      },
      fontFamily: {
        display: ['"DM Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      fontSize: {
        xs: ['11px', '1.5'],
        sm: ['13px', '1.5'],
        base: ['15px', '1.5'],
        lg: ['17px', '1.2'],
        xl: ['20px', '1.2'],
        '2xl': ['24px', '1.2'],
        '3xl': ['30px', '1.2'],
      },
      letterSpacing: {
        tight: '-0.01em',
        badge: '0.05em',
      },
    },
  },
  plugins: [],
}
