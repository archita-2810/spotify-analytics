import { NextResponse } from "next/server";
require('dotenv').config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

const getAccessToken = async () => {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basic}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Failed to fetch access token" }, { status: 500 });
  }

  const data = await res.json();
  return NextResponse.json({ access_token: data.access_token });
};

export async function GET() {
  return getAccessToken();
}
