import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:     '#1A6FE8',
          blueDark: '#1459BF',
          blueDeep: '#0D3C8A',
          green:    '#3DD94A',
          greenDark:'#22B830',
          amber:    '#F5A623',
          amberDark:'#D4881A',
        },
      },
    },
  },
  plugins: [],
}

export default config
