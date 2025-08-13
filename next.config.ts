import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'smoemdfpvkatezrsrttu.supabase.co',
				port: '',
				pathname: '/storage/v1/object/public/**',
			},
		],
	},
	// CSS 최적화 설정
	experimental: {
		optimizeCss: true,
		// CSS 번들링 최적화
		optimizePackageImports: ['@fontsource/pretendard'],
	},
	// CSS 번들링 최적화
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
	// CSS 로딩 최적화
	webpack: (config, { dev, isServer }) => {
		if (!dev && !isServer) {
			// 프로덕션에서 CSS 최적화
			config.optimization.splitChunks.cacheGroups.styles = {
				name: 'styles',
				test: /\.(css|scss)$/,
				chunks: 'all',
				enforce: true,
			};
		}
		return config;
	},
};

export default nextConfig;
