"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const RecentlyPlayed = () => {
    const [userId, setUserId] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [recentTracks, setRecentTracks] = useState([]);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch(`/api/users`);
                const userData = await response.json();

                console.log("User data:", userData);

                if (!userData.user._id) {
                    console.error("No userId found in user data");
                    return;
                }

                setUserId(userData.user._id);
                setAccessToken(userData.user.accessToken || null);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (!accessToken) return;

        const fetchAccessToken = async () => {
            try {
                const response = await fetch('/api/users');
                const tokenData = await response.json();

                console.log("Token data:", tokenData);

                if (!tokenData.user.accessToken) {
                    console.error("No access token found");
                    return;
                }

                setAccessToken(tokenData.user.accessToken);
            } catch (error) {
                console.error("Error fetching access token:", error);
            }
        };

        fetchAccessToken();
    }, [userId]);

    useEffect(() => {
        if (!accessToken) {
            console.log("No access token available yet.");
            return;
        }

        const fetchRecentlyPlayed = async () => {
            try {
                console.log("Fetching recently played with token:", accessToken);
                const response = await fetch(
                    "https://api.spotify.com/v1/me/player/recently-played?limit=10",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Spotify API Error:", response.status, errorText);
                    return;
                }

                const data = await response.json();
                console.log("Fetched Recently Played:", data);

                const uniqueTracks = data.items.filter(
                    (track, index, self) =>
                        index === self.findIndex((t) => t.track.id === track.track.id)
                );

                setRecentTracks(uniqueTracks || []);
            } catch (error) {
                console.error("Error fetching recently played:", error);
            }
        };

        fetchRecentlyPlayed();
    }, [accessToken]);

    return (
        <div className="m-3 bg-white/10 text-white rounded-lg flex flex-col items-center p-3 w-max">
            <h2 className="text-xl font-semibold mb-4">🎵 Recently Played</h2>

            <div className="flex items-center justify-center overflow-x-auto space-x-4 scrollbar-hide">
                {recentTracks.map((track, index) => (
                    <motion.div
                        key={`${track.track.id}-${index}`}
                        className="text-center flex flex-col items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <Image
                            src={track.track.album.images[0].url}
                            alt={track.track.name}
                            width={112}
                            height={112}
                            className="rounded-md"
                            priority
                        />
                        <p className="text-sm mt-2 truncate">{track.track.name}</p>
                        <p className="text-xs text-gray-400">{track.track.artists[0].name}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyPlayed;
