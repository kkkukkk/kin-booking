module.exports = {
  theme: {
    extend: {
      screens: {
        'xs': '376px',
      },
    },
  },
  // CSS 최적화 설정
  future: {
    hoverOnlyWhenSupported: true,
  },
  // CSS 번들링 최적화
  experimental: {
    optimizeUniversalDefaults: true,
  },
  // CSS purging 최적화
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
}; 