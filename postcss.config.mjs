export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    // CSS 최적화 플러그인 추가
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          discardComments: {
            removeAll: true,
          },
          normalizeWhitespace: true,
        }],
      },
    }),
  },
};
