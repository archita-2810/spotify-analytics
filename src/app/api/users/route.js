import { NextResponse } from "next/server";
import connectToMongo from "@/app/lib/mongodb";
import User from "@/app/models/User";
import { cookies } from "next/headers";

export async function GET(req) {
  try {
    await connectToMongo();

    const user = await User.findOne({});

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Error fetching user" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToMongo();

    const { spotifyId, displayName, email, profileUrl, accessToken } =
      await req.json();

    let user = await User.findOne({ spotifyId });
    if (!user) {
      user = new User({
        spotifyId,
        displayName,
        email,
        profileUrl,
        accessToken,
      });
      await user.save();
    } else {
      user.accessToken = accessToken;
      await user.save();
    }

    const userIdString = user._id.toString();
    console.log("Setting userId cookie:", userIdString);

    cookies().set("userId", userIdString, {
      httpOnly: true,
      path: "/",
      sameSite: "Strict",
    });

    return NextResponse.json({ message: "User saved", user }, { status: 201 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ message: "Error saving user" }, { status: 500 });
  }
}
