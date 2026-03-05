// Blueprint Theme Design System

export const BLUEPRINT_THEME = {
  // Blueprint Colors
  colors: {
    // Background - Dark blueprint paper
    bg: {
      primary: '#0A1929',      // Dark navy blueprint
      secondary: '#0D2136',    // Slightly lighter
      tertiary: '#132F4C',     // Panel backgrounds
    },
    
    // Blueprint Lines - Cyan/Blue technical drawing lines
    lines: {
      primary: '#00B8D9',      // Bright cyan - main lines
      secondary: '#0097B2',    // Darker cyan - grid
      tertiary: '#006B8C',     // Subtle grid
      accent: '#00E5FF',       // Highlighted elements
    },
    
    // Text - Blueprint style
    text: {
      primary: '#B2D4FF',      // Light blue text
      secondary: '#80B3FF',    // Medium blue
      muted: '#5B8EC0',        // Dimmed text
      bright: '#FFFFFF',       // Pure white for emphasis
    },
    
    // Accent Colors - Technical highlights
    accent: {
      orange: '#FF9100',       // Warning/selection
      green: '#00E676',        // Success/active
      red: '#FF3D00',          // Error/delete
      yellow: '#FFD600',       // Caution
    },
  },
  
  // Technical Fonts
  fonts: {
    heading: '"Orbitron", "Roboto Mono", monospace',  // Futuristic
    body: '"Share Tech Mono", "Courier New", monospace', // Technical
    technical: '"JetBrains Mono", monospace',         // Code/measurements
  },
  
  // Grid System
  grid: {
    size: 20,           // 20px grid
    opacity: 0.15,      // Subtle grid lines
    color: '#00B8D9',   // Cyan grid
  },
  
  // Measurements Style
  measurements: {
    lineWidth: 1,
    arrowSize: 6,
    textSize: '10px',
    color: '#00E5FF',
  }
};

// Blueprint UI Components Styling
export const BLUEPRINT_STYLES = {
  // Cards/Panels - Technical boxes
  panel: `
    background: linear-gradient(135deg, #0D2136 0%, #0A1929 100%);
    border: 1px solid #00B8D9;
    box-shadow: 
      0 0 20px rgba(0, 184, 217, 0.1),
      inset 0 0 60px rgba(0, 184, 217, 0.05);
  `,
  
  // Buttons - Technical style
  button: `
    background: transparent;
    border: 2px solid #00B8D9;
    color: #B2D4FF;
    font-family: 'Share Tech Mono', monospace;
    text-transform: uppercase;
    letter-spacing: 2px;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 184, 217, 0.3), transparent);
      transition: left 0.5s;
    }
    
    &:hover::before {
      left: 100%;
    }
  `,
  
  // Input Fields - Technical measurement style
  input: `
    background: rgba(13, 33, 54, 0.5);
    border: 1px solid #00B8D9;
    color: #B2D4FF;
    font-family: 'JetBrains Mono', monospace;
    padding: 8px 12px;
    
    &:focus {
      border-color: #00E5FF;
      box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
    }
  `,
  
  // Technical Grid Background
  gridBackground: `
    background-color: #0A1929;
    background-image: 
      linear-gradient(rgba(0, 184, 217, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 184, 217, 0.1) 1px, transparent 1px);
    background-size: 20px 20px;
  `
};