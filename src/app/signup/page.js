"use client";

import { getSpotifyToken } from "@/app/hooks/spotifyauth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Signup = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        if (data.user) {
          setUserId(data.user.spotifyId);
        } else {
          console.error("User ID not found in database");
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchToken = async () => {
      try {
        const accessToken = await getSpotifyToken(userId);
        setToken(accessToken);
      } catch (error) {
        console.error("Error fetching Spotify token:", error);
      }
    };

    fetchToken();
  }, [userId]);

  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const response = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user profile");

        const userData = await response.json();
        setUser(userData);

        await saveUserToDB(userData, token);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserProfile();
  }, [token]);

  const saveUserToDB = async (userData, accessToken) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spotifyId: userData.id,
          displayName: userData.display_name,
          email: userData.email,
          profileUrl: userData.external_urls.spotify,
          accessToken,
        }),
      });

      if (!response.ok) throw new Error("Failed to save user in MongoDB");

      console.log("User saved successfully");
    } catch (error) {
      console.error("Error saving user to database:", error);
    }
  };

  const handleLogin = () => {
    router.push("/api/spotify/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Sign Up with Spotify</h1>

      {user ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <img
            src={user.images?.[0]?.url || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold">{user.display_name}</h2>
          <p className="text-gray-400">{user.email}</p>
          <p className="text-sm mt-2">
            🎵 Welcome, {user.display_name}! Your Spotify account is connected.
          </p>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
        >
          Sign in with Spotify
        </button>
      )}
    </div>
  );
};

export default Signup;
