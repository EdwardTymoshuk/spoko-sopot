/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'pub-6b43bbf3eb884034863e85b0eefe37a8.r2.dev',
				pathname: '/**',
			},
		],
	},
}

export default nextConfig
