/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ hostname: "agile-magpie-985.convex.cloud" },
			{hostname: "oaidalleapiprodscus.blob.core.windows.net"},
		],
	},
};

export default nextConfig;