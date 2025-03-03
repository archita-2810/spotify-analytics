"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Pause, SkipForward } from "lucide-react";
import Image from "next/image";

const NowPlaying = () => {
  const [song, setSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchNowPlaying = async () => {
    try {
      const tokenResponse = await fetch("/api/users");
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.user.accessToken;

      if (!accessToken) {
        console.error("No access token available");
        return;
      }

      const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch song");
      }

      const data = await response.json();

      if (data && data.item) {
        setSong({
          title: data.item.name || "Unknown Song",
          artist: data.item.artists[0]?.name || "Unknown Artist",
          albumArt:
            data.item.album.images[0]?.url ||
            "https://source.unsplash.com/60x60/?music,album",
        });
        setIsPlaying(data.is_playing);
      } else {
        setSong(null);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error fetching now playing:", error);
    }
  };

  useEffect(() => {
    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 10000);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = async () => {
    try {
      const tokenResponse = await fetch("/api/users");
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.user.accessToken;

      if (!accessToken) {
        console.error("No access token available");
        return;
      }

      const endpoint = isPlaying
        ? "https://api.spotify.com/v1/me/player/pause"
        : "https://api.spotify.com/v1/me/player/play";

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to toggle play/pause");
      }

      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  const skipToNext = async () => {
    try {
      const tokenResponse = await fetch("/api/users");
      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.user.accessToken;

      if (!accessToken) {
        console.error("No access token available");
        return;
      }

      const response = await fetch(
        "https://api.spotify.com/v1/me/player/next",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to skip track");
      }

      fetchNowPlaying(); // Refresh to update the UI with the new song
    } catch (error) {
      console.error("Error skipping track:", error);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 flex items-center gap-4 w-[90%] max-w-xl shadow-lg">
      {song ? (
        <>
          <Image
            src={song.albumArt}
            alt="Album Art"
            width={48}
            height={48}
            className="rounded-lg object-cover"
          />

          <div className="flex flex-col flex-1">
            <h3 className="text-white text-sm font-semibold">{song.title}</h3>
            <p className="text-gray-300 text-xs">{song.artist}</p>
          </div>

          <div className="flex gap-1 items-end">
            {[4, 6, 8].map((h, i) => (
              <motion.div
                key={i}
                animate={{ height: isPlaying ? [h, h * 1.5, h] : h }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: "easeInOut",
                }}
                className="w-1 bg-green-500 rounded"
              />
            ))}
          </div>

          <button
            onClick={togglePlay}
            className="text-white p-2 rounded-full hover:bg-white/20"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={skipToNext}
            className="text-white p-2 rounded-full hover:bg-white/20"
          >
            <SkipForward size={20} />
          </button>
        </>
      ) : (
        <p className="text-gray-300 text-sm">Login to get your current playing 🥰</p>
      )}
    </div>
  );
};

export default NowPlaying;
