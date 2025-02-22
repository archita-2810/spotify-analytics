import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

const useSpotifyAuth = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchTokenFromAPI();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchTokenFromAPI = async () => {
    try {
      const response = await fetch("/api/spotify/token");
      const data = await response.json();

      if (!data.access_token) {
        throw new Error("Failed to fetch Spotify token");
      }

      setToken(data.access_token);
      saveTokenToFirestore(data.access_token);
      fetchUserProfile(data.access_token);
    } catch (error) {
      console.error("Error fetching token:", error);
    }
  };

  const saveTokenToFirestore = async (accessToken) => {
    try {
      const userRef = doc(db, "spotify_users", auth.currentUser.uid);
      await setDoc(userRef, { access_token: accessToken }, { merge: true });
      console.log("Token saved to Firestore!");
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const fetchUserProfile = async (accessToken) => {
    if (!accessToken) return;

    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setUser(data);
      saveUserToFirestore(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const saveUserToFirestore = async (userData) => {
    try {
      const userRef = doc(db, "spotify_users", userData.id);
      await setDoc(userRef, userData, { merge: true });
      console.log("User data saved to Firestore!");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return { token, user };
};

export default useSpotifyAuth;
