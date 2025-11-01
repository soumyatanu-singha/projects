"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-100">
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-10 py-5 bg-black/90 backdrop-blur border-b border-red-600/20 sticky top-0 z-50">
       <h1
          className="text-3xl font-extrabold text-red-500 tracking-tight"
          style={{ fontFamily: "Arial Black, Helvetica, sans-serif" }}
        >
          Ambulance<span className="text-white">.</span>
        </h1>
        <div className="hidden md:flex space-x-8 text-gray-300 font-medium">
          <Link href="#features" className="hover:text-red-500 transition-colors">Features</Link>
          <Link href="#about" className="hover:text-red-500 transition-colors">About</Link>
          <Link href="#contact" className="hover:text-red-500 transition-colors">Contact</Link>
        </div>
        <Link href="/choice">
          <button className="px-5 py-2 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 transition">
            SignUp
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-20">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight max-w-3xl text-white">
          Emergency Care, <span className="text-red-500">When Seconds Matter</span>
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mt-6">
          Instantly book ambulances and track them live.  
          Speed and reliability, powered by technology — built to save lives.
        </p>
        <div className="mt-10 flex flex-row space-x-4">
          <Link href="/book">
            <button className="px-8 py-3 gap-5 flex flex-row items-center bg-black shadow-red-600 shadow-xl  hover:shadow-red-500/100 text-white hover:text-red-600 rounded-3xl text-lg font-semibold  transition">
              
              
<lord-icon
    src="https://cdn.lordicon.com/papxnmwt.json"
    trigger="hover"
    colors="primary:#ffffff,secondary:#c71f16"
   style={{ width:90 ,height:90 }}>
</lord-icon>


              Request Ambulance
            </button>
          </Link>
          <Link href="#features">
            <button className="px-8 py-10 bg-black border border-red-600 text-red-500 rounded-3xl text-lg font-semibold  hover:text-white transition">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-black text-center">
        <h3 className="text-4xl font-bold text-white mb-14">Why Choose AmbulanceApp?</h3>
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <div className="p-8 bg-black border border-black rounded-2xl shadow-xl shadow-red-500/70 hover:shadow-green-500/70 transition">
            <div className="text-4xl mb-4">

<lord-icon
    src="https://cdn.lordicon.com/warimioc.json"
    trigger="hover"
    colors="primary:#ffffff,secondary:#c71f16"
      style={{ width:90 ,height:90 }}>
</lord-icon>

            </div>
            <h4 className="text-xl font-semibold text-red-500 mb-3">Lightning Fast Response</h4>
            <p className="text-gray-400">Get an ambulance dispatched in minutes with live ETA tracking.</p>
          </div>
          <div className="p-8 bg-black border border-black rounded-2xl shadow-xl shadow-red-500/70 hover:shadow-green-500/70 transition">
            <div className="text-4xl mb-4">

<lord-icon
    src="https://cdn.lordicon.com/onmwuuox.json"
    trigger="hover"
    colors="primary:#ffffff,secondary:#c71f16"
    style={{ width:90 ,height:90 }}>
</lord-icon>

              
            </div>
            <h4 className="text-xl font-semibold text-red-500 mb-3">Real-Time Location</h4>
            <p className="text-gray-400">Track your ambulance in real-time and stay updated at every step.</p>
          </div>
           <div className="p-8 bg-black border border-black rounded-2xl shadow-xl shadow-red-500/70 hover:shadow-green-500/70 transition">
            <div className="text-4xl mb-4">

<lord-icon
    src="https://cdn.lordicon.com/uppnozfl.json"
    trigger="hover"
    colors="primary:#ffffff,secondary:#c71f16"
    style={{ width:90 ,height:90 }}>
</lord-icon>




            </div>
            <h4 className="text-xl font-semibold text-red-500 mb-3">Trusted Professionals</h4>
            <p className="text-gray-400">Our trained staff and reliable network ensure your safety 24/7.</p>
          </div>
        </div>
      </section>

    
<section className="flex flex-col md:flex-row w-full h-[550px] md:h-[750px]">


  <Link href="/book" className="flex-1">
    <div className="flex flex-col justify-center items-center h-full bg-red-600 cursor-pointer px-10 md:px-20 relative overflow-hidden">
      <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-6 drop-shadow-lg">
        Request Ambulance
      </h3>
      <p className="text-white text-center max-w-md mb-10 drop-shadow-md">
        Quickly request an ambulance and track it in real-time.
      </p>
      <button className="px-12 py-4 bg-white text-red-600 font-semibold rounded-full shadow-md hover:bg-gray-400 transition-all duration-300">
        Request Now
      </button>
      {/* Diagonal overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 rotate-6 pointer-events-none"></div>
    </div>
  </Link>

  {/* Register Hospital */}
  <Link href="/hospital" className="flex-1">
    <div className="flex flex-col justify-center items-center h-full bg-black border-l border-red-600 cursor-pointer px-10 md:px-20 relative overflow-hidden">
      <h3 className="flex items-center flex-col justify-center text-3xl md:text-5xl font-extrabold text-red-500 mb-6 drop-shadow-lg space-x-4">
  <span className="text-center mb-2 mt-15 ">Register as Hospital</span>
  <span className="text-white ">Or</span>
  <span className="mt-2">Driver</span>
</h3>

      <p className="text-white text-center max-w-md mb-10 drop-shadow-md">
        Join our network and manage your hospital ambulance services.
      </p>
      <button className="px-12 py-4 bg-red-600 text-white font-semibold rounded-full shadow-md hover:bg-red-400 transition-all duration-300">
        Register Now
      </button>
      {/* Optional subtle diagonal overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-red-600/10 rotate-12 pointer-events-none"></div>
    </div>
  </Link>
</section>






      {/* Footer */}
      <footer id="contact" className="bg-black text-gray-500 py-8 text-center border-t border-red-600/30">
        <p>© {new Date().getFullYear()} AmbulanceApp. All rights reserved.</p>
        <p className="mt-2">
          Need help?{" "}
          <a href="mailto:support@ambulanceapp.com" className="text-red-400 hover:underline">
            Contact Us
          </a>
        </p>
      </footer>
    </div>
  );
}
