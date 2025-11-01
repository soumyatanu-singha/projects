"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function SaaSProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (session?.user?.email) {
      console.log("Fetching profile for:", session.user.email);
      fetch(`/api/profile?email=${session.user.email}`)
        .then(async (res) => {
          console.log(" Response status:", res.status);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          console.log("Got profile data:", data);
          setProfile(data);
        })
        .catch((err) => console.error("Error fetching profile:", err));
    }
  }, [session]);

  if (status === "loading") {
    return (
      <main className="flex justify-center items-center min-h-screen text-white">
        <p>Loading profile...</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="flex justify-center items-center min-h-screen text-white">
        <p>You're not logged in.</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex justify-center items-center min-h-screen text-white">
        <p>Fetching your profile...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-black text-green-400">
      {/* NAVBAR */}
     <nav className="sticky justify-between flex top-0 backdrop-blur-md shadow-xl border border-black hover:bg-white hover:shadow-white hover:border-l-black hover:text-black rounded-3xl  items-center px-8 py-4">
        <h1 className="text-4xl font-extrabold">Profile .</h1>

        <Link
          href="/after_signup"
          className="flex items-center px-6 py-3 bg-black hover:text-green-400 shadow-green-400 shadow-xl text-white text-xl font-bold rounded-2xl transform hover:scale-110 hover:shadow-white transition duration-300 ease-out"
        >
          <lord-icon
            src="https://cdn.lordicon.com/shcfcebj.json"
            trigger="hover"
            colors="primary:#ffffff,secondary:#16c72e"
            style={{ width: "60px", height: "60px" }}
            className="mr-3"
          ></lord-icon>
          Home
        </Link>
      </nav>

      
     <main className="flex flex-col justify-center items-center py-20 px-4 min-h-screen bg-zinc-950">
    {/* Radial Gradient Background Detail for Depth */}
    <div className="absolute inset-0 z-0 opacity-50 pointer-events-none" 
         style={{ 
             background: 'radial-gradient(circle at 50% 10%, rgba(74, 222, 128, 0.15) 0%, transparent 40%)'
         }}
    ></div>

    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
  duration: 0.8, 
  ease: [0.25, 1, 0.5, 1] // <--- CORRECT FORMAT
}}// Smoother ease function
        className="relative z-10 p-10 bg-zinc-900/60 rounded-[35px] 
                   shadow-[0_20px_60px_rgba(0,0,0,0.8),_0_0_50px_rgba(74,222,128,0.4)] 
                   backdrop-blur-xl border border-green-500/30 hover:shadow-[0_25px_70px_rgba(0,0,0,1),_0_0_65px_rgba(74,222,128,0.7)]
                   transition-all duration-500 w-[95%] max-w-lg"
    >
        {/* Avatar Section */}
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center mb-8"
        >
            <div className="relative group">
                {/* Outer Ring Glow - Softest */}
                <div className="absolute inset-[-10px] rounded-full ring-4 ring-green-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Inner Ring Glow - Sharper */}
                <div className="absolute inset-[-4px] rounded-full ring-2 ring-green-400/60 blur-sm"></div>

                <Image
                    src={profile?.image || "/images/50339f6f-3f5c-499e-816c-d9d1f36092e6.jpeg"}
                    alt="User Avatar"
                    width={140}
                    height={140}
                    className="rounded-full object-cover border-4 border-green-400 shadow-xl shadow-green-500/50 group-hover:scale-[1.03] transition-transform duration-400"
                />
            </div>
        </motion.div>

        {/* Header */}
        <motion.h1
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-4xl font-black text-white text-center mb-1 tracking-tighter"
        >
            {profile.fullName || profile.name || "User Profile"}
        </motion.h1>

        {/* Subheader/Email */}
        <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-xl font-medium text-green-400/80 text-center mb-8"
        >
            {profile.email}
        </motion.p>

        {/* Details Section */}
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="space-y-5 text-xl"
        >
            {/* Conditional Detail: Full Name (if different from header) */}
            {profile.fullName && (
                <div className="flex justify-between items-center pb-2 border-b border-green-700/50 hover:border-green-400/70 transition-all duration-300">
                    <strong className="text-white/90 font-semibold tracking-wide">Full Name:</strong>
                    <span className="text-green-300/90">{profile.fullName}</span>
                </div>
            )}

            {/* Conditional Detail: Hospital Name */}
            {profile.name && (
                <div className="flex justify-between items-center pb-2 border-b border-green-700/50 hover:border-green-400/70 transition-all duration-300">
                    <strong className="text-white/90 font-semibold tracking-wide">Hospital:</strong>
                    <span className="text-green-300/90">{profile.name}</span>
                </div>
            )}
            
            {/* Phone Detail */}
            {profile.phone && (
                <div className="flex justify-between items-center pb-2 border-b border-green-700/50 hover:border-green-400/70 transition-all duration-300">
                    <strong className="text-white/90 font-semibold tracking-wide">Phone:</strong>
                    <span className="text-green-300/90">{profile.phone}</span>
                </div>
            )}

            {/* ✅ Added Account Created Date */}
            {profile.createdAt && (
              <div className="flex justify-between items-center pb-2 border-b border-green-700/50 hover:border-green-400/70 transition-all duration-300">
                <strong className="text-white/90 font-semibold tracking-wide">
                  Account Created:
                </strong>
                <span className="text-green-300/90">
                  {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            )}
        </motion.div>

        {/* Animated Corner Detail (Cyberpunk Aesthetic) */}
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-green-500/80 rounded-tr-[35px] opacity-70"
        />
    </motion.div>
</main>
    </div>
  );
}
