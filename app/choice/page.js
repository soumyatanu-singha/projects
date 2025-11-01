"use client";
import { useRouter } from "next/navigation";

export default function SignupChoice() {
  const router = useRouter();

  return (
    <section className="min-h-screen flex items-center justify-center bg-black px-6 py-12">
      <div className="absolute top-6 left-8">
        <h1 className="text-5xl font-extrabold text-white tracking-tight" style={{ fontFamily: "Arial Black, Helvetica, sans-serif" }}>
          Ambulance<span className="text-green-500">.</span>
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-12 w-full max-w-5xl">
        {/* Book Ambulance Card */}
        <div className="flex-1 flex flex-col justify-center items-center h-[500px] bg-black rounded-3xl p-10 shadow-xl shadow-green-500/40 hover:shadow-green-500/100 text-center">
         
         <span>
          <lord-icon
    src="https://cdn.lordicon.com/shcfcebj.json"
    trigger="hover"
    colors="primary:#ffffff,secondary:#16c72e"
    style={{ width:150 ,height:150 }}>
</lord-icon>
         </span>
         
         
          <h2 className="text-3xl font-bold text-white mb-6">Book an Ambulance</h2>
          <p className="text-green-100 mb-10 max-w-sm">
            Quickly request an ambulance and get real-time updates on its location.
          </p>
          <button
            onClick={() => router.push("/book")}
            className="px-10 py-4 bg-white text-green-600 font-semibold rounded-full shadow-lg hover:bg-gray-200 transition"
          >
            Request Now
          </button>
        </div>

        {/* Hospital Registration Card */}
        <div className="flex-1 flex flex-col justify-center items-center h-[500px] bg-black   rounded-3xl p-10 shadow-xl shadow-green-500/40 hover:shadow-green-500/100 text-center">
          
          <span><lord-icon
    src="https://cdn.lordicon.com/jectmwqf.json"
    trigger="hover"
    colors="primary:#ffffff,secondary:#16c72e"
    style={{ width:150 ,height:150 }}>
</lord-icon></span>
          
          <h2 className="text-3xl font-bold text-green-500 mb-6">Register as Hospital <nobr className="text-white">/</nobr> Driver</h2>
          <p className="text-gray-300 mb-10 max-w-sm">
            Join our network and manage your hospital ambulance services efficiently.
          </p>
          <button
            onClick={() => router.push("/hospital")}
            className="px-10 py-4 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition"
          >
            Register Now
          </button>
        </div>
      </div>
    </section>
  );
}
