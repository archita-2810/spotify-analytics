import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSpotifyToken } from "@/app/hooks/spotifyauth";
import connectToMongo from "@/app/lib/mongodb";
import User from "@/app/models/User";

export async function GET(req) {
  try {
    connectToMongo();
    console.log("All cookies", (await cookies()).getAll());
    const userId = cookies().get("userId").value;
    console.log("retrieved userid from cookies..", userId);
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const spotifyId = user.spotifyId;
    if (!spotifyId) {
      return NextResponse.json({ error: "Spotify ID not linked" }, { status: 400 });
    }

    const accessToken = await getSpotifyToken(spotifyId);
    return NextResponse.json({ access_token: accessToken });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get access token", details: error.message }, { status: 500 });
  }
}
