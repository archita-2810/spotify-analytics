"use client"
import { motion } from "framer-motion";

const Hero = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center items-center text-center px-6 md:py-10 py-2 sm:px-10 lg:px-20 gap-y-8">
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-xl sm:text-2xl lg:text-3xl font-semibold">
                    Your Music. Your Stats. Your Story. 🎧
            </motion.p>
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="text-sm sm:text-base lg:text-lg">
                    Discover the rhythms that define you! Spotify Analytics helps you track your top artists, favorite genres, and most-played tracks. 
                    Dive into detailed stats, visualize your listening trends, and gain personalized insights into your music journey. Stay in tune with your music preferences effortlessly!
            </motion.p>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5">
                    <motion.button
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-transparent hover:text-green-500 border border-green-500 transition-all duration-300 w-full sm:w-auto">
                            Track Your Progress
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                        className="bg-transparent text-white px-4 py-2 rounded-full font-semibold hover:bg-green-500 border border-green-500 transition-all duration-300 w-full sm:w-auto">
                            Explore Insights
                    </motion.button>
            </motion.div>
        </motion.div>
    );
}

export default Hero;
