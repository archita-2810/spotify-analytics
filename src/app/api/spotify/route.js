import { NextResponse } from "next/server";

const client_id = "2f60491a3952467583ae3d786851aace";
const client_secret = "278acb46c4874de7a3cfe84e3a2ead11";

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
