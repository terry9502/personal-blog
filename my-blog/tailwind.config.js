/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            // 专门为表格添加样式
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
              fontSize: '0.875em',
              lineHeight: '1.7142857',
              borderCollapse: 'collapse',
              borderSpacing: '0',
            },
            thead: {
              color: 'inherit',
              fontWeight: '600',
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-th-borders)',
            },
            'thead th': {
              color: 'inherit',
              fontWeight: '600',
              verticalAlign: 'bottom',
              paddingRight: '0.5714286em',
              paddingBottom: '0.5714286em',
              paddingLeft: '0.5714286em',
              backgroundColor: 'rgb(249 250 251)',
              border: '1px solid rgb(229 231 235)',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-td-borders)',
            },
            'tbody td': {
              verticalAlign: 'baseline',
              padding: '0.5714286em',
              border: '1px solid rgb(229 231 235)',
            },
            // 深色模式表格样式
            '.dark &': {
              'thead th': {
                backgroundColor: 'rgb(31 41 55)',
                border: '1px solid rgb(75 85 99)',
                color: 'rgb(209 213 219)',
              },
              'tbody td': {
                border: '1px solid rgb(75 85 99)',
                color: 'rgb(229 231 235)',
              },
              'tbody tr:nth-child(even)': {
                backgroundColor: 'rgb(17 24 39)',
              },
            },
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              color: 'inherit',
              fontWeight: '600',
            },
            code: {
              color: 'inherit',
              fontWeight: '600',
            },
            pre: {
              color: 'inherit',
              backgroundColor: 'transparent',
            },
            blockquote: {
              color: 'inherit',
              borderLeftColor: 'currentColor',
              opacity: 0.8,
            },
            h1: { color: 'inherit' },
            h2: { color: 'inherit' },
            h3: { color: 'inherit' },
            h4: { color: 'inherit' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}