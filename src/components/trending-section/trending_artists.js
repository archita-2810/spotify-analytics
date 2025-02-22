"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Artists = () => {
  const [topArtists, setTopArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        console.log("Fetching Spotify token...");
        const tokenResponse = await fetch("/api/spotify/token");
        const tokenData = await tokenResponse.json();

        if (!tokenData || !tokenData.access_token) {
          throw new Error("Failed to fetch access token");
        }

        console.log("Token received:", tokenData.access_token);

        console.log("Fetching top artists...");
        const response = await fetch(
          "https://api.spotify.com/v1/artists?ids=06HL4z0CvFAxyc27GXpf02,1uNFoZAHBGtllmzznpCI3s,4Z8W4fKeB5YxbusRsdQVPb,1Xyo4u8uXC1ZmMpatF05PJ,6eUKZXaKkcviH0Ku9w2n3V,66CXWjxzNUsdJxJ2JdwvnR,3TVXtAsR1Inumwj472S9r4,246dkjvS1zLTtiykXe5h60,5pKCCKE2ajJHZ9KAiaK11H,5vBSrE1xujD2FXYRarbAXc",
          {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
          }
        );

        const data = await response.json();

        if (!data || !data.artists) {
          throw new Error("Failed to fetch artists.");
        }

        const sortedArtists = data.artists
          .map((artist) => ({
            id: artist.id,
            name: artist.name,
            image: artist.images?.[0]?.url || "/placeholder.jpg",
            url: artist.external_urls.spotify,
            followers: artist.followers.total,
          }))
          .sort((a, b) => b.followers - a.followers);

        setTopArtists(sortedArtists);
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, []);

  return (
    <div className="bg-white/10 m-3 rounded-lg">
      {loading ? (
        <p className="text-white text-center">Loading top artists...</p>
      ) : (
        <div className="p-4">
          <h2 className="text-xl text-white mb-4 font-semibold text-center">
            Top Artists 🌟
          </h2>

          <div className="hidden md:grid grid-cols-5 gap-6">
            {topArtists.slice(0, 5).map((artist, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 p-3 bg-black/20 rounded-lg shadow-lg"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-400">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-white text-sm font-medium">{artist.name}</h3>
                <p className="text-gray-300 text-xs">
                  {artist.followers.toLocaleString()} Followers
                </p>
                <a
                  href={artist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 text-xs hover:text-white"
                >
                  View on Spotify
                </a>
              </div>
            ))}
          </div>

          <div className="md:hidden overflow-hidden mt-4">
            <motion.div
              className="flex gap-5"
              animate={{ x: ["0%", "-200%"] }}
              transition={{
                ease: "linear",
                duration: 15,
                repeat: Infinity,
              }}
            >
              {(topArtists.length >= 10 ? topArtists.slice(0, 10) : topArtists).concat(topArtists.length >= 10 ? topArtists.slice(0, 10) : topArtists).map((artist, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[120px] bg-black/20 p-2 rounded-lg shadow-lg"
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-400">
                    <Image
                      src={artist.image}
                      alt={artist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-white text-xs font-medium mt-1">
                    {artist.name}
                  </h3>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artists;
