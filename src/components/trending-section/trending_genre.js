
"use client";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const GenrePopularity = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchGenreData = async () => {
      try {
        const tokenResponse = await fetch("/api/spotify/user-token");
        const tokenData = await tokenResponse.json();

        if (!tokenData || !tokenData.access_token) {
          throw new Error("Failed to fetch access token");
        }

        console.log("Token received:", tokenData.access_token);
        const response = await fetch("https://api.spotify.com/v1/me/top/artists?limit=50", {
            headers: {
              Authorization: `Bearer ${tokenData.access_token}`,
              "Content-Type": "application/json",
            },
        });
    
        if (!response.ok) throw new Error("Failed to fetch top artists");
    
        const result = await response.json();
        const genreCount = {};
        result.items.forEach((artist) => {
          artist.genres.forEach((genre) => {
              genreCount[genre] = (genreCount[genre] || 0) + 1;
          });
        });
    
        const chartData = Object.entries(genreCount).map(([name, streams]) => ({ name, streams }));
        setData(chartData);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenreData();
  }, []);

  return (
    <div className="m-3 bg-white/10 text-white rounded-lg">
      <div className="p-3">
        <h2 className="text-lg font-semibold text-center mb-4">🎵 Genre Popularity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Bar dataKey="streams" fill="#1DB954" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GenrePopularity;
