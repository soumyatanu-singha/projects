export async function geocodeAddress(address) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await res.json();

  if (data.length > 0) {
    // Return [latitude, longitude] as numbers
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } else {
    console.error("Geocoding failed: no results");
    return null;
  }
}
