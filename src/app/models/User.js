import mongoose from "mongoose";
import connectToMongo from "@/app/lib/mongodb";

const UserSchema = new mongoose.Schema({
    spotifyId: { type: String, required: true, unique: true },
    displayName: String,
    email: String,
    profileUrl: String,
    accessToken: String,
    refreshToken: String,
    expiresAt: Number,
});

const User = mongoose.models?.User || mongoose.model("User", UserSchema);
export default User;