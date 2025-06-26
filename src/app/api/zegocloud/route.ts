import { generateToken04 } from "./zegoServerAssistant"; // adjust path if needed

export async function GET(req: Request) {
	const url = new URL(req.url);
	const userID = url.searchParams.get("userID");

	const appID = +process.env.NEXT_PUBLIC_ZEGO_APP_ID!;
	const serverSecret = process.env.NEXT_PUBLIC_ZEGO_SERVER_SECRET!;
	const effectiveTimeInSeconds = 3600;
	const payload = "";

	// ✅ Validate input
	if (!userID || !appID || !serverSecret) {
		return new Response(JSON.stringify({ error: "Missing required parameters" }), {
			status: 400,
			headers: { "Content-Type": "application/json" },
		});
	}

	try {
		const token = generateToken04(appID, userID, serverSecret, effectiveTimeInSeconds, payload);
		return new Response(JSON.stringify({ token, appID }), {
			status: 200,
			headers: { "Content-Type": "application/json" },
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: "Token generation failed", details: error }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
tum hii krdo route.ts mein ye replace kro aur commit kro