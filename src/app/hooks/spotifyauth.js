import connectToMongo from "@/app/lib/mongodb";
import User from "@/app/models/User";

export const getSpotifyToken = async (userId) => {
    connectToMongo();

    const user = await User.findOne({ spotifyId: userId });

    if (!user) {
        throw new Error("User not found in MongoDB");
    }

    if (Date.now() > user.expiresAt) {
        const newTokenData = await refreshSpotifyToken(user.refreshToken);

        user.accessToken = newTokenData.access_token;
        user.expiresAt = Date.now() + newTokenData.expires_in * 1000;

        await user.save();
        return newTokenData.access_token;
    }

    return user.accessToken;
};

const refreshSpotifyToken = async (refresh_token) => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    return response.json();
};