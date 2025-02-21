"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const Trending = () => {
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        console.log("Fetching Spotify token...");
        const tokenResponse = await fetch("/api/spotify");
        const tokenData = await tokenResponse.json();
  
        if (!tokenData || !tokenData.access_token) {
          throw new Error("Failed to fetch access token");
        }
  
        console.log("Token received:", tokenData.access_token);
  
        console.log("Fetching trending tracks...");
        // const playlist_id = "37i9dQZF1DXcBWIGoYBM5M";
        const response = await fetch(`https://api.spotify.com/v1/playlists/3cEYpjA9oz9GiPac4AsH4n`, {
          headers: {
            // "Content-Type": "application/json",
            // "Accept": "application/json",
            Authorization: `Bearer ${tokenData.access_token}`
          },
        });
  
        const data = await response.json();
        console.log("Data received:", data);
  
        if (!data.tracks || !data.tracks.items) {
          throw new Error("Invalid API response structure");
        }
  
        const tracks = data.tracks.items.map((item) => ({
          title: item.track.name,
          image: item.track.album.images[0]?.url,
          url: item.track.external_urls.spotify,
        }));
  
        setTrendingTracks(tracks);
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTrendingData();
  }, []); 

  return (
    <div className="flex md:flex-col flex-row gap-8 p-4">
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <>
          <div className="w-full">
            {/* <h2 className="text-xl font-bold mb-4">🔥 Trending Playlists</h2> */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {trendingTracks.map((track, index) => (
                <div key={index} className="bg-white/10 p-3 rounded-lg">
                  <div className="relative w-full h-40">
                    <Image
                      src={track.image || "/placeholder.jpg"}
                      alt={track.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h3 className="text-white text-sm mt-2">{track.title}</h3>
                  <a href={track.url} target="_blank" rel="noopener noreferrer" className="text-green-400 text-xs hover:text-white">
                    Listen on Spotify
                  </a>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Trending;
