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
};

export default nextConfig;
