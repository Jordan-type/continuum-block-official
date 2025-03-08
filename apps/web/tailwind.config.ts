import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem", // Default padding for mobile (smaller screens)
          sm: "2rem",
          md: "2.5rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
        screens: {
          "xs": "320px", // Extra small screens (phones, e.g., iPhone SE)
          "sm": "640px", // Small screens (phones, e.g., iPhone 12)
          "md": "768px", // Medium screens (tablets, small laptops)
          "lg": "1024px", // Large screens (laptops)
          "xl": "1280px", // Extra large screens (desktops)
          "2xl": "1400px", // 2x Extra large screens (large desktops)
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        customgreys: {
          primarybg: "#1B1C22",
          secondarybg: "#25262F",
          darkGrey: "#17181D",
          darkerGrey: "#3d3d3d",
          dirtyGrey: "#6e6e6e",
        },
        primary: {
          "50": "#F5E9FB", // Lightest purple shade
          "100": "#EADDF7",
          "200": "#D7BDF1",
          "300": "#C29DEA",
          "400": "#A87BE2",
          "500": "#8F5AD9", // Mid-tone purple
          "600": "#7A44CF",
          "700": "#690FA2", // Your specified Primary color
          "800": "#5A0C89",
          "900": "#4B0970",
          "950": "#2F0550", // Darkest purple shade
          DEFAULT: "#690FA2", // "hsl(var(--primary))"
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          "50": "#F8F5FA", // Lightest lavender purple shade
          "100": "#F2ECF6",
          "200": "#E8DDEF",
          "300": "#D8C7E5",
          "400": "#C8B0DB",
          "500": "#B899D1", // Mid-tone lavender purple
          "600": "#A984C6",
          "700": "#987BBA", // Your specified Secondary color
          "800": "#80649F",
          "900": "#6C5586",
          "950": "#4D3D62", // Darkest lavender purple shade
          DEFAULT: "#987BBA", //"hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        white: {
          "50": "#d2d2d2",
          "100": "#ffffff",
          // DEFAULT: "#ffffff",
        },
        tertiary: {
          "50": "#E9B306",
        },
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        md: ["1rem", { lineHeight: "1.5rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "3.5rem" }], // Adjusted for mobile readability
        "6xl": ["3.75rem", { lineHeight: "4rem" }],
      },
      spacing: {
        "0.5": "0.125rem", // 2px (extra small for mobile)
        "1.5": "0.375rem", // 6px
        "2.5": "0.625rem", // 10px
        "3.5": "0.875rem", // 14px
      },
      width: {
        "1/8": "12.5%",
        "3/8": "37.5%",
        "5/8": "62.5%",
        "7/8": "87.5%",
      },
      height: {
        "1/8": "12.5%",
        "3/8": "37.5%",
        "5/8": "62.5%",
        "7/8": "87.5%",
      },
      maxWidth: {
        "screen-xs": "320px", // Extra small screens
        "screen-sm": "640px",
        "screen-md": "768px",
        "screen-lg": "1024px",
        "screen-xl": "1280px",
        "screen-2xl": "1400px",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), "prettier-plugin-tailwindcss"],
} satisfies Config;

export default config;