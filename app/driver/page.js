"use client";
import { useState, useEffect,useRef } from "react";
import Link from "next/link";

export default function DriverPage() {
  const [drivers, setDrivers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [fare, setFare] = useState("");
   const [map, setMap] = useState(null);
    const mapRef = useRef(null);
  
  const [markers, setMarkers] = useState([]);


  

  async function geocodeLocation(name) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          name
        )}`
      );
      const data = await res.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (err) {
      console.error("Geocode failed:", err);
      return null;
    }
  }

  async function handleAddLocation() {
    if (!map) return;
    if (!location.trim()) return alert("Please enter a location");

    const coords = await geocodeLocation(location);
    if (!coords) {
      alert("Invalid location");
      return;
    }

    const marker = L.marker([coords.lat, coords.lon]).addTo(map);
    marker.bindPopup(`<b>${location}</b>`);

    // Hover animation (popup + zoom-in effect)
    marker.on("mouseover", function () {
      this.openPopup();
      this._icon.style.transform = "scale(1.2)";
      this._icon.style.transition = "transform 0.2s";
    });
    marker.on("mouseout", function () {
      this.closePopup();
      this._icon.style.transform = "scale(1)";
    });

    const newMarkers = [...markers, marker];
    setMarkers(newMarkers);

    const group = L.featureGroup(newMarkers);
    map.fitBounds(group.getBounds().pad(0.2));

    setLocation(""); // clear input after adding
  }

  // Load all drivers
  const loadDrivers = async () => {
  const res = await fetch("/api/driver");
  const data = await res.json();
  console.log(data);

  // if the response is an object with a "drivers" key
  setDrivers(Array.isArray(data) ? data : data.drivers || []);
};


  useEffect(() => {
    loadDrivers();
  }, []);

  const openModal = (driver = null) => {
    if (driver) {
      setEditingId(driver.id);
      setName(driver.type);
      setLocation(driver.status);
      setFare(driver.fare || ""); // populate if editing existing record
    } else {
      setEditingId(null);
      setName("");
      setLocation("");
      setFare("");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const driverData = { id: editingId, name, location, fare };

    if (editingId) {
      await fetch("/api/driver", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driverData),
      });
    } else {
      await fetch("/api/driver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(driverData),
      });
    }

    closeModal();
    loadDrivers();
  };

  const handleDelete = async (id) => {
    await fetch("/api/driver", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadDrivers();
  };

  

   useEffect(() => {
    if (!mapRef.current) return; // Wait for the DOM element
    const myMap = L.map(mapRef.current).setView([22.5726, 88.3639], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(myMap);
    setMap(myMap);

    return () => myMap.remove();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-400 font-sans">
      <nav className="sticky justify-between flex top-0 backdrop-blur-md shadow-xl border border-black hover:bg-white hover:shadow-white hover:border-l-black hover:text-black rounded-3xl  items-center px-8 py-4">
        <h1 className="text-4xl font-extrabold">Services .</h1>

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
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <button
          onClick={() => openModal()}
          className="mb-8 ml-60 shadow-white shadow-lg text-white transition-transform transform hover:scale-105 rounded-2xl hover:bg-white hover:text-black font-bold py-5 px-25 mt-20"
        >
          Create Service
        </button>

        <section className="bg-black shadow-lg shadow-green-400 rounded-lg p-6 mb-25">
          <h2 className="text-2xl font-semibold mb-4 border-b text-white pb-2">
            Current Services Ongoing
          </h2>

          <ul className="divide-y divide-green-800">
            {drivers.map((d) => (
              <li key={d.id} className="py-3 flex items-center justify-between">
                <span className="select-none text-white">
                  {d.type} – {d.status} – ₹{d.fare}
                </span>
                <div className="flex gap-2 ">
                  <button
                    onClick={() => openModal(d)}
                    className="px-4 py-2 bg-green-600 rounded-md transition-transform transform hover:scale-105 hover:text-black hover:bg-white active:scale-95 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md transition-transform transform hover:scale-105 hover:text-black hover:bg-white active:scale-95"
                  >
                    Terminate
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          onMouseDown={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-white bg-white p-6 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-black mb-4">
              {editingId ? "Edit Driver" : "Add Driver"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <label className="block">
                <span className="text-sm text-black font-bold">Name</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-black/80 border border-green-700 px-3 py-2 text-green-100"
                />
              </label>

              <label className="block">
                <span className="text-sm text-black font-bold">Location</span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-black/80 border border-green-700 px-3 py-2 text-green-100"
                />
              </label>

              <label className="block">
                <span className="text-sm text-black font-bold">Fare (₹)</span>
                <input
                  type="number"
                  value={fare}
                  onChange={(e) => setFare(e.target.value)}
                  className="mt-1 w-full rounded-xl bg-black/80 border border-green-700 px-3 py-2 text-green-100"
                  min="0"
                  step="0.01"
                />
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md bg-green-800/40 hover:bg-green-800/60 text-green-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-black font-semibold"
                onClick={handleAddLocation}
                >
                  Save
                </button>
              </div>
            </form>

            
          </div>
        </div>
      )}

    <div
  ref={mapRef}
  style={{
    height: "80vh",
    width: "80%",
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
  onMouseOver={e => {
    e.currentTarget.style.boxShadow = "0 0 80px 16px #10ffb3, 0 8px 48px rgba(26,255,157,0.35)";
    e.currentTarget.style.borderColor = "#ffdd57";
    e.currentTarget.style.background = "linear-gradient(135deg, rgba(34,193,195,0.25) 0%, rgba(253,233,45,0.21) 100%)";
  }}
  onMouseOut={e => {
    e.currentTarget.style.boxShadow = "0 8px 48px 0 rgba(26,255,157,0.25), 0 1.5px 5px 0 #3e5ec2";
    e.currentTarget.style.borderColor = "#10ffb3";
    e.currentTarget.style.background = "linear-gradient(135deg, rgba(34,193,195,0.25) 0%, rgba(253,187,45,0.09) 100%)";
  }}
></div>


    </div>
  );
}
