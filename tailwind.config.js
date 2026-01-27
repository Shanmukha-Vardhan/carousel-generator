/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'ui-bg': 'var(--ui-bg)',
                'ui-surface': 'var(--ui-surface)',
                'ui-surface-hover': 'var(--ui-surface-hover)',
                'ui-border': 'var(--ui-border)',
                'ui-text': 'var(--ui-text)',
                'ui-text-muted': 'var(--ui-text-muted)',
                'accent-primary': 'var(--accent-primary)',
                'accent-primary-hover': 'var(--accent-primary-hover)',
                'accent-danger': 'var(--accent-danger)',
                'slide-text': 'var(--slide-text)',
            },
            fontFamily: {
                'display': ['"Bebas Neue"', 'sans-serif'],
                'ui': ['"Inter"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
