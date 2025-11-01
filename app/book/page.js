// app/book-signup/page.js
"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";



export default function BookSignup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    
    password: "",
  });

 

// ... in your component or page
const handleSignIn = async () => {
  await signIn("google", { callbackUrl: "/after_signup" }); // Redirects to /dashboard after successful GitHub login
};

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert("User Registered Successfully ✅");
        setForm({ fullName: "", email: "", phone: "", password: "" });
      } else {
        // Show backend error (like unique constraint)
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while registering.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-black px-6 py-12">
      
      {/* Top Left Logo */}
      <div className="absolute top-6 left-8 flex items-center">
        <h1
          className="text-5xl font-extrabold text-white tracking-tight"
          style={{
            fontFamily: "Arial Black, Helvetica, sans-serif", // Deloitte-like bold sans serif
          }}
        >
          Ambulance<span className="text-green-500">.</span>
        </h1>
      </div>

      {/* Signup Form */}
      <div className="w-full max-w-xl bg-black rounded-2xl shadow-2xl shadow-green-400/100 p-10">
        <h2 className="text-3xl font-extrabold text-center text-white mb-2">
           Book an Ambulance
        </h2>
       

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2 text-sm">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black border border-black shadow-green-500 shadow-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 text-sm">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black border border-black shadow-green-500 shadow-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>







          <div>
            <label className="block text-white mb-2 text-sm">Phone</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black border border-black shadow-green-500 shadow-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          <div>
           
          </div>

          <div>
            <label className="block text-white mb-2 text-sm">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-black border border-black shadow-green-500 shadow-lg text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>
         

          <button
            type="submit"
            className="w-full py-3 bg-green-500 text-black font-semibold rounded-full  hover:bg-green-700 transition"
          onClick={handleSignIn}
          >
            Sign Up
          </button>



        </form>
         <div className="mt-5" >

           <button 
           onClick={() => signIn("google", { callbackUrl: "/after_signup" })}
           className="w-full px-4 py-5 rounded-full items-center hover:bg-gray-300  bg-white border border-green-600 text-black  ">
              
Sign up with Google
              
              
              </button>


         </div>
      </div>

         
    </section>
  );
}
