/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "agile-magpie-985.convex.cloud" },
		],
	},
};

export default nextConfig;