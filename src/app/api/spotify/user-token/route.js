import { NextResponse } from "next/server";
import { getSpotifyToken } from "@/app/hooks/spotifyauth";
import connectToMongo from "@/app/lib/mongodb";
import mongoose from "mongoose";
import User from "@/app/models/User";

export async function GET(req) {
  try {
    await connectToMongo();

    const userResponse = await fetch("http://localhost:3000/api/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ error: "Failed to fetch user" }, { status: userResponse.status });
    }

    const userData = await userResponse.json();
    const user = userData.user;

    if (!user || !user._id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const spotifyId = await User.findOne({ spotifyId: user.spotifyId });
    console.log("user id is thissss", spotifyId);
    if (!spotifyId) {
      return NextResponse.json({ error: "Spotify ID not linked" }, { status: 400 });
    }

    const accessToken = await getSpotifyToken(spotifyId);
    return NextResponse.json({ access_token: accessToken });
  } catch (error) {
    console.error("Error fetching Spotify token:", error);
    return NextResponse.json({ error: "Failed to get access token", details: error.message }, { status: 500 });
  }
}
