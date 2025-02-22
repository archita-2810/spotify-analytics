import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

export async function GET() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json({ error: "Missing Spotify credentials" }, { status: 500 });
  }

  const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authString}`,
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: "Failed to fetch access token", details: errorData }, { status: 500 });
    }

    const data = await res.json();

    const response = NextResponse.json({ access_token: data.access_token, expires_in: data.expires_in });
    response.headers.set("Set-Cookie", `spotify_access_token=${data.access_token}; HttpOnly; Secure; Path=/; Max-Age=${data.expires_in}`);
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}
