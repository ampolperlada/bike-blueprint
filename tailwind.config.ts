import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // Blueprint Theme
        'bp-bg': {
          primary: '#0A1929',
          secondary: '#0D2136',
          tertiary: '#132F4C',
        },
        'bp-line': {
          primary: '#00B8D9',
          secondary: '#0097B2',
          tertiary: '#006B8C',
          accent: '#00E5FF',
        },
        'bp-text': {
          primary: '#B2D4FF',
          secondary: '#80B3FF',
          muted: '#5B8EC0',
          bright: '#FFFFFF',
        },
        'bp-accent': {
          orange: '#FF9100',
          green: '#00E676',
          red: '#FF3D00',
          yellow: '#FFD600',
        },
      },
      fontFamily: {
        technical: ['"Share Tech Mono"', 'monospace'],
        heading: ['"Orbitron"', 'monospace'],
        code: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'border-flow': 'border-flow 1.5s linear infinite',
        'scan': 'scan 2.5s ease-in-out infinite',
      },
      keyframes: {
        'border-flow': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 200%' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(300%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;