import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const SCOPE = "user-read-private user-read-email";

export async function GET() {
  const authURL = `https://accounts.spotify.com/authorize?` + 
    new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: "code",
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
    }).toString();

  return NextResponse.redirect(authURL);
}
