import { NextResponse } from "next/server";
import connectToMongo from "@/app/lib/mongodb";
import User from "@/app/models/User";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

export async function GET(req) {
    const { searchParams } = req.nextUrl;
    const code = searchParams.get("code");
    // cconsole.log("Full Request URL: ", req.url);
    console.log("Extracted Code: ", searchParams.get("code"));
    

    if (!code) {
        return NextResponse.json({ error: "Authorization code is missing." }, { status: 400 });
    }

    try {
        const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code,
                redirect_uri: REDIRECT_URI,
            }),
        });

        if (!tokenRes.ok) {
            const errorData = await tokenRes.json();
            return NextResponse.json({ error: "Failed to exchange token", details: errorData }, { status: 500 });
        }

        const tokenData = await tokenRes.json();
        const { access_token, refresh_token, expires_in } = tokenData;

        const userRes = await fetch("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!userRes.ok) {
            return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
        }

        const userData = await userRes.json();

        connectToMongo();

        await User.findOneAndUpdate(
            { spotifyId: userData.id },
            {
                displayName: userData.display_name,
                email: userData.email,
                profileUrl: userData.external_urls.spotify,
                accessToken: access_token,
                refreshToken: refresh_token,
                expiresAt: Date.now() + expires_in * 1000,
            },
            { upsert: true, new: true }
        );

        const response = NextResponse.redirect(new URL("/", req.url));
        response.headers.set(
            "Set-Cookie",
            `spotify_access_token=${access_token}; HttpOnly; Secure; Path=/; Max-Age=${expires_in}`
        );

        return response;
    } catch (error) {
        return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
    }
}
