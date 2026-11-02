/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#0B1120',      // Primary Background
          sidebar: '#0F172A',      // Sidebar Background
          card: '#172033',         // Card Background
          elevated: '#1E293B',     // Elevated Surface
          border: '#334155',       // Borders
          textPrimary: '#F8FAFC',  // Primary Text
          textSecondary: '#94A3B8',// Secondary Text
        },
        brand: {
          blue: '#3B82F6',         // Primary Blue
          hover: '#2563EB',        // Hover Blue
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        status: {
          success: '#22C55E',      // Success Green
          warning: '#F59E0B',      // Warning Amber
          error: '#EF4444',        // Error Red
          available: '#22C55E',
          occupied: '#EF4444',
          accessible: '#3B82F6',
          reserved: '#F59E0B',
          maintenance: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.2)',
        'elevated-dark': '0 10px 25px -3px rgba(0, 0, 0, 0.5), 0 4px 10px -2px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
