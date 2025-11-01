"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TextType from "../components/TextType";
import { geocodeAddress } from "@/geocode";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Dashboard() {

  const { data: session } = useSession();


  const [bookedAmbulance, setBookedAmbulance] = useState(null);

  const mapRef = useRef(null);


  const [map, setMap] = useState(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const liveMarkerRef = useRef(null);
  const socketRef = useRef(null);

  // Form state
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");

  // Nearby ambulances
  const [nearbyAmbulances, setNearbyAmbulances] = useState([]);
  const [loading, setLoading] = useState(false);
 const [ambulanceName, setambulanceName] = useState("");
 const [fare, setfare] = useState("");
 const [ambulanceEmail, setambulanceEmail] = useState("");

  const leafletMapRef = useRef(null);
  const markersRef = useRef([]);

  // initialize map once
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current).setView([22.5726, 88.3639], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    leafletMapRef.current = map;
  }, []);

  // update markers whenever nearby ambulances change
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map) return;

    // remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // add new markers
    nearbyAmbulances.forEach((amb) => {
      if (amb.lat && amb.lon) {
        const marker = L.marker([amb.lat, amb.lon]).addTo(map);
        markersRef.current.push(marker);
      }
    });
  }, [nearbyAmbulances]);













  const handleSearchNearby = async () => {
    if (!fromLocation || !toLocation) {
      toast.error("Please enter both From and To locations");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/after_signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromLocation, toLocation }),
      });

      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        setNearbyAmbulances([]);
      } else {
        setNearbyAmbulances(data.nearby || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch nearby ambulances");
      setNearbyAmbulances([]);
    }
    setLoading(false);
  };





 useEffect(() => {
    if (typeof window === "undefined") return;

    const myMap = L.map("map").setView([22.5726, 88.3639], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(myMap);
    setMap(myMap);
  }, []);

  // Connecting to socket.io
  useEffect(() => {
    if (!map) return;

    const socket = io(); // same-origin (works with Next.js custom server)
    socketRef.current = socket;

    socket.on("connect", () => console.log("Connected to Socket.IO server"));
    socket.on("disconnect", () => console.log("Disconnected"));

    // Listen for incoming location updates
    socket.on("locationUpdate", ({ lat, lng }) => {
      const coords = [lat, lng];

      if (!liveMarkerRef.current) {
        liveMarkerRef.current = L.marker(coords, {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
            iconSize: [30, 30],
          }),
        })
          .addTo(map)
          .bindPopup("Live Location");
      } else {
        liveMarkerRef.current.setLatLng(coords);
      }

      map.setView(coords, map.getZoom());
    });

    return () => socket.disconnect();
  }, [map]);

  // Emit current location using socket
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => {
          socket.emit("updateLocation", {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
  }, []);

  // Draw the route between two addresses
  const handleRoute = async () => {
    if (!map) return;
    const fromCoords = await geocodeAddress(from);
    const toCoords = await geocodeAddress(to);
    if (!fromCoords || !toCoords) return alert("Invalid locations");

    // Remove old routes/markers except live
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== liveMarkerRef.current)
        map.removeLayer(layer);
      if (layer instanceof L.Polyline) map.removeLayer(layer);
    });

    const fromMarker = L.marker(fromCoords).addTo(map).bindPopup(`From: ${from}`);
    const toMarker = L.marker(toCoords).addTo(map).bindPopup(`To: ${to}`);
    map.fitBounds(L.featureGroup([fromMarker, toMarker]).getBounds());

    const [fromLat, fromLng] = fromCoords;
    const [toLat, toLng] = toCoords;
    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.routes?.length > 0) {
      const routeCoords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      L.polyline(routeCoords, { color: "red", weight: 5 }).addTo(map);
    }
  };


const handleBookAmbulance = async (amb) => {
  try {
    setBookedAmbulance(amb);

    //  Fetch ambulance location by ID (use query param)
    const res = await fetch(`/api/after_signup?id=${amb.id}`);
    const data = await res.json();

    setambulanceName(amb.type);
    setfare(amb.fare);

    if (data?.location?.address) {
      const address = data.location.address;
      setTo(address);
      toast.info(`Ambulance booked!\nDestination set to: ${address}`);
    } else {
      toast.error("Failed to fetch ambulance location.");
    }
  } catch (error) {
    console.error("Booking error:", error);
    toast.error("Error booking ambulance.");
  }
};


useEffect(() => {
  if (to) {
    console.log("To is now:", to);
  }
}, [to]);


const handleBookingData = async (amb) => {
  try {
    // Check if session exists
    if (!session?.user) {
      alert("Please log in to book an ambulance");
      return;
    }

    // Validate required fields
    if (!fromLocation || !toLocation) {
      alert("Please enter both From and To locations");
      return;
    }

    const bookingPayload = {
      userId: session.user.id || session.user._id || "guest",
      userName: session.user.name || "Unknown",
      userEmail: session.user.email || "",
      ambulanceId: amb.id,
      ambulanceName: amb.type,
      fare: amb.fare, 
      fromLocation,
      toLocation,
    };

    console.log("Sending booking data:", bookingPayload);

    const res = await fetch("/api/after_signup/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    });

    const data = await res.json();

    if (res.ok) {
      console.log("Booking successful:", data);
      toast.success(`Ambulance booked successfully!\nBooking ID: ${data.bookingId || "N/A"}`);
    } else {
      console.error(" Booking failed:", data);
      alert(`Booking failed: ${data.error || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error booking ambulance:", error);
    toast.error("Network error. Please try again.");
  }
};

  



  return (
    <section className="min-h-screen bg-black text-white px-8 py-6">
    
      <header className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-6xl shadow-green font-bold mb-2">Welcome!</h1>
          <TextType
            className="text-4xl"
            text={[
              "Your safety is our priority ",
              "Quick ambulance booking at your fingertips",
              "Always here in emergencies ",
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="|"
            textColors={["#3cfa39ff", "#b6f235ff", "#f53333ff"]}
            loop={true}
          />
        </div>

        <Link
          href="/bookAmbulance"
          className="flex items-center px-6 py-3 bg-black hover:text-green-400 shadow-green-400 shadow-xl text-white text-xl font-bold rounded-2xl transform hover:scale-110 hover:shadow-white transition duration-300 ease-out"
        >
          <lord-icon
            src="https://cdn.lordicon.com/shcfcebj.json"
            trigger="hover"
            colors="primary:#ffffff,secondary:#16c72e"
            style={{ width: "60px", height: "60px" }}
            className="mr-3"
          ></lord-icon>
          Profile
        </Link>
      </header>

      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Booking Form */}
        <div className="md:w-1/2 flex flex-col items-center mt-30 justify-center">
          <div className="bg-black p-6 rounded-2xl shadow-lg w-full max-w-md relative">
            <div className="absolute left-20 top-17 h-26 flex flex-col items-center justify-between">
              <div className="w-0.5 h-full bg-white rounded"></div>
            </div>

            <div className="flex text-black flex-col space-y-20 ml-8">
              <div className="flex">
                <input
                  type="text"
                  placeholder="From"
                  value={fromLocation}
                  
          onChange={(e) => {
    const value = e.target.value;
    setFrom(value);
    setFromLocation(value);
  }}
                  className="w-full bg-black shadow-white shadow-lg text-white placeholder-gray-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-white transition"
                />
              </div>
              <div className="flex">
                <input
                  type="text"
                  placeholder="To"
                  value={toLocation}
                  onChange={(e) => {
                    const value = e.target.value;
                    setToLocation(value)
                  
                
                }}
                  className="w-full bg-black shadow-white shadow-lg text-white placeholder-gray-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-white transition"
                />
              </div>
              <button
               onClick={() => {
  handleSearchNearby();
 
}}

                
                className="w-full text-lg bg-black hover:bg-green-400 text-white font-bold py-3 hover:text-black rounded-xl shadow-green-400 shadow-lg transition transform hover:scale-105"
              >
                {loading ? "Searching..." : "Search Nearby"}
              </button>
            </div>
          </div>
        </div>

        {/* Leaflet Map */}
        <div
  ref={mapRef}
  className="md:w-1/2"
   style={{
    height: "80vh",
    width: "100%",
    margin: "2rem auto",
    borderRadius: "30px",
    boxShadow: "0 8px 48px 0 rgba(26,255,157,0.25), 0 1.5px 5px 0 #3e5ec2",
    border: "4px solid #10ffb3",
    background: "linear-gradient(135deg, rgba(34,193,195,0.25) 0%, rgba(253,187,45,0.09) 100%)",
    backdropFilter: "blur(8px)",
    transition: "box-shadow 0.4s, border-color 0.4s, background 0.4s",
    position: "relative",
    overflow: "hidden",
    zIndex: 0
  }}
></div>

      </div>

      {/* Nearby Ambulances List */}
      <section className="mt-16 border-t border-gray-700/30 pt-10">
  <h2 className="text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400">
    Nearby Ambulances
  </h2>

  {nearbyAmbulances.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {nearbyAmbulances.map((amb, idx) => (
        <div
          key={idx}
          className="relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md shadow-[0_8px_32px_rgba(31,38,135,0.2)] transition-all duration-100 hover:shadow-[0_8px_40px_rgba(16,255,179,0.4)] hover:scale-[1.03]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition duration-100"></div>

          <div className="relative p-6">
            <h3 className="text-2xl font-semibold text-white mb-3">
              {amb.type || `Ambulance ${idx + 1}`}
            </h3>

            <div className="space-y-2 text-gray-300 text-base">
              <p>
                <span className="font-medium text-gray-100">Status:</span>{" "}
                {amb.status || "Unavailable"}
              </p>
              <p>
                <span className="font-medium text-gray-100">Fare:</span> ₹
                {amb.fare || "N/A"}
              </p>
              <p>
                <span className="font-medium text-gray-100">Distance:</span>{" "}
                {amb.distance ? amb.distance.toFixed(2) + " km" : "Unknown"}
              </p>
            </div>
            <button
  onClick={() =>{ 
    
     handleRoute();
    handleBookAmbulance(amb);
  handleBookingData(amb)}
  }
  className="mt-4 w-full text-lg bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-xl transition transform hover:scale-105"
>
  {bookedAmbulance?.id === amb.id ? "Booked" : "Book Ambulance"}
</button>

          </div>

          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-20 text-gray-400 text-lg font-medium tracking-wide">
      No nearby ambulances found.
    </div>
  )}
</section>
 <div id="map" className="border rounded-2xl" style={{  margin: "2rem auto",
    borderRadius: "30px",
    boxShadow: "0 8px 48px 0 rgba(26,255,157,0.25), 0 1.5px 5px 0 #3e5ec2",
    border: "4px solid #10ffb3",
    background: "linear-gradient(135deg, rgba(34,193,195,0.25) 0%, rgba(253,187,45,0.09) 100%)",
    backdropFilter: "blur(8px)",
    transition: "box-shadow 0.4s, border-color 0.4s, background 0.4s",
    position: "relative",
    overflow: "hidden",
    zIndex: "0" , height: "500px", width: "100%" }}></div>



 <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="dark"
/>


    </section>
  );
}
