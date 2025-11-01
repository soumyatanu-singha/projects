"use client";
import { useState } from "react";

export default function HospitalSignup() {
  const [form, setForm] = useState({
    hospitalName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/hospital", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();


    
    if (res.ok) {
      alert("Hospital Registered Successfully ");
      console.log("Saved hospital:", data.hospital);
      setForm({ hospitalName: "", email: "", phone: "", address: "", password: "" });
    } else {
   
      alert(data.error);
    }
  } catch (err) {
    
    console.error(err);
    alert("Something went wrong. Please try again.");
  }
};


  return (
    <section className="min-h-screen bg-black px-6 py-12 relative flex flex-col items-center">
      {/* Top Left Logo */}
      <div className="absolute top-6 left-8 flex items-center z-50">
        <h1
          className="text-5xl font-extrabold text-green-500 tracking-tight"
          style={{ fontFamily: "Arial Black, Helvetica, sans-serif" }}
        >
          Ambulance<span className="text-white">.</span>
        </h1>
      </div>

      <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-12 text-center z-10">
        Hospital <nobr>/</nobr> Driver Registration
      </h2>
      <p className="text-center text-green-400 mb-16 max-w-xl z-10">
        Join our network of trusted ambulance providers
      </p>

      {/* Cards Grid */}
     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl  pb-40">
        {/* Hospital Name */}
        <div className="bg-black border border-black rounded-2xl shadow-green-500 shadow-xl p-6 flex flex-col">
          <label className="text-white mb-2 text-sm">Hospital <nobr>/</nobr> Driver Name</label>
          <input
            type="text"
            name="hospitalName"
            placeholder="Enter hospital name"
            value={form.hospitalName}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-black border border-green-600 text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        {/* Email */}
        <div className="bg-black border border-black rounded-2xl shadow-green-500 shadow-xl p-6 flex flex-col">
          <label className="text-white mb-2 text-sm">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-black border border-green-600 text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        {/* Phone */}
        <div className="bg-black border border-black rounded-2xl shadow-green-500 shadow-xl p-6 flex flex-col">
          <label className="text-white mb-2 text-sm">Phone</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-black border border-green-600 text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        {/* Address */}
        <div className="bg-black border border-black rounded-2xl shadow-green-500 shadow-xl p-6 flex flex-col">
          <label className="text-white mb-2 text-sm">Hospital Address</label>
          <input
            type="text"
            name="address"
            placeholder="Enter hospital address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-black border border-green-600 text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>

        {/* Password */}
        <div className="bg-black border border-black rounded-2xl shadow-green-500 shadow-xl p-6 flex flex-col">
          <label className="text-white mb-2 text-sm">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg bg-black border border-green-600 text-white placeholder-green-300/60 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
        </div>
      </div>

      {/* Submit Button at bottom */}
      <button
        onClick={handleSubmit}
        className="fixed bottom-0 left-0 w-full border border-white py-5 bg-transparent text-white font-semibold text-lg rounded-t-3xl hover:text-black  hover:bg-green-400 transition"
      >
        Register Now
      </button>
    </section>
  );
}
