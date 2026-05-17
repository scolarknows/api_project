/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["DM Sans", "sans-serif"],     // replaces default sans
                // OR use a custom key:
                dm: ["DM Sans", "sans-serif"],       // use as font-dm
            },
        },
    },
    plugins: [],
};