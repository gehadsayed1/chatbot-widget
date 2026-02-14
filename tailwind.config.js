/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-dark-rgb) / <alpha-value>)",
        "primary-light": "rgb(var(--color-primary-light-rgb) / <alpha-value>)",
        "primary-hover": "rgb(var(--color-primary-hover-rgb) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
