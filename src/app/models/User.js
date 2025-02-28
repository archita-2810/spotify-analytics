import mongoose from "mongoose";
import connectToMongo from "@/app/lib/mongodb";

const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    spotifyId: { type: String, required: true, unique: true },
    displayName: String,
    email: String,
    profileUrl: String,
    accessToken: String,
    refreshToken: String,
    expiresAt: Number,
});
// console.log("yooo we here - ",mongoose.models); 
const User = mongoose.models?.User || mongoose.model("User", UserSchema);
// console.log("yoooo we here again ",User);
export default User;