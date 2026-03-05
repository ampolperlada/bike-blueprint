import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        
        // Blueprint Theme Colors
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
        technical: ['"Share Tech Mono"', 'Courier New', 'monospace'],
        heading: ['"Orbitron"', 'Roboto Mono', 'monospace'],
        code: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'border-flow': 'border-flow 1s linear infinite',
        'scan': 'scan 2s ease-in-out infinite',
      },
      keyframes: {
        'border-flow': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '100px 100px' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
