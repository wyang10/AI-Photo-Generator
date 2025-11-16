// Importing Tailwind's Config type for TypeScript support
import type { Config } from "tailwindcss";

// Define the Tailwind configuration
const config: Config = {
  // Specify content paths to enable Tailwind to scan for class names
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // Extend the theme to add custom styles and configurations
  theme: {
    extend: {
      // Add custom colors using CSS variables or hex values
      colors: {
        background: "var(--background)", // Use CSS variable for background color
        foreground: "var(--foreground)", // Use CSS variable for foreground color
        primary: "#1D4ED8", // Customize as needed
        secondary: "#6366F1", // Customize as needed
      },

      // Add custom fonts if needed
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Replace "Inter" with your desired font
      },

      // Additional theme customizations can go here
      spacing: {
        18: "4.5rem", // Example: custom spacing value
      },

      // Define custom shadows for depth effects
      boxShadow: {
        "custom-light": "0 2px 5px rgba(0, 0, 0, 0.1)",
        "custom-dark": "0 4px 15px rgba(0, 0, 0, 0.2)",
      },
    },
  },

  // Plugins can be added here if you need additional Tailwind functionality
  plugins: [],
};

// Export the configuration
export default config;
