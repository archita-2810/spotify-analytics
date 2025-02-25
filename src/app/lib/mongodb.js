"use server"
import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/spotify-analytics-users";

const connectToMongo = async() => {
    if (!MONGODB_URI) {
        throw new Error("❌ MongoDB URI is missing!");
    }

    if (mongoose.connection?.readyState >= 1) {
        console.log("🔹 Using existing MongoDB connection.");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Connected to MongoDB");
    } catch (error) {
        console.error("❌ Error connecting to MongoDB:", error);
        throw error;
    }
}

export default connectToMongo;
