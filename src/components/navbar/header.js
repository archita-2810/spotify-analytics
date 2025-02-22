"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import useSpotifyAuth from "@/app/hooks/spotifyauth";
import { auth, provider } from "../../app/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSpotifyAuth();

  const handleSignIn = async () => {
    window.location.href = "/api/spotify/login";
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User Signed Out");
    } catch (error) {
      console.error("Error Signing Out:", error);
    }
  };

  return (
    <header className="bg-black/30 backdrop-blur-lg text-green-300 mx-3 my-9 p-4 rounded-full shadow-lg shadow-green-400/20 flex justify-between items-center border border-green-400/30 transition-all duration-300 hover:shadow-green-400/50 font-poppins relative">
      <div className="md:text-2xl text-base font-bold flex items-center space-x-2">
        <span className="animate-pulse">🎵</span>
        <span className="hover:text-green-400 transition-all duration-300">
          Spotify Analytics
        </span>
      </div>

      <nav>
        <ul className="hidden md:flex space-x-6 text-lg">
          <li className="hover:text-green-400 transition-all duration-300 cursor-pointer">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-green-400 transition-all duration-300 cursor-pointer">
            <Link href="/">Stats</Link>
          </li>
          <li className="hover:text-green-400 transition-all duration-300 cursor-pointer">
            <Link href="/">Playlists</Link>
          </li>
          <li className="hover:text-green-400 transition-all duration-300 cursor-pointer">
            <Link href="/">Users</Link>
          </li>
        </ul>
      </nav>

      {user ? (
        <div className="flex items-center space-x-4">
          <img
            src={user?.photoURL || "/default-avatar.png"}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border border-green-400"
          />
          <button
            onClick={handleSignOut}
            className="bg-red-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-red-400 transition-all duration-300"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={handleSignIn}
          className="hidden md:block bg-green-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-green-400 transition-all duration-300"
        >
          SignIn
        </button>
      )}

      <button
        className="md:hidden p-2 text-green-300 hover:text-green-400 transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-black/90 backdrop-blur-lg p-4 flex flex-col items-center space-y-4 border-t border-green-400/30 shadow-lg md:hidden">
          <Link
            href="/"
            className="text-lg hover:text-green-400 transition-all duration-300"
          >
            Home
          </Link>
          <Link
            href="/"
            className="text-lg hover:text-green-400 transition-all duration-300"
          >
            Stats
          </Link>
          <Link
            href="/"
            className="text-lg hover:text-green-400 transition-all duration-300"
          >
            Playlists
          </Link>
          {user ? (
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-red-400 transition-all duration-300 w-full"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={handleSignIn}
              className="bg-green-500 text-black px-4 py-2 rounded-full font-semibold hover:bg-green-400 transition-all duration-300 w-full"
            >
              SignIn
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
