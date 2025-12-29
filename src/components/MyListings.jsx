import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { toast } from "react-hot-toast";
import UpdateCarModal from "./UpdateCarModal";
import { endpoint } from "../api";

const MyListings = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const getToken = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser)
          throw new Error("User not logged in. Please login first.");
        const token = await currentUser.getIdToken();
        setAccessToken(token);
      } catch (err) {
        console.error(err);
        setError(err.message);
      }
    };

    getToken();
  }, []);

  // Fetch car listings

  useEffect(() => {
    if (!accessToken) return;

    const fetchCars = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint("/api/car/my-listings"), {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setCars(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load listings. Token may be invalid or expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [accessToken]);

  // Delete handler

  const handleDelete = (car) => setDeleteCandidate(car);

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    if (!accessToken) {
      toast.error("User not logged in. Please login first.");
      return;
    }

    try {
      const response = await fetch(
        endpoint(`/api/cars/${deleteCandidate._id}`),
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete car.");
      setCars((prev) => prev.filter((c) => c._id !== deleteCandidate._id));
      toast.success(`Car ${deleteCandidate.name} deleted successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete car.");
    } finally {
      setDeleteCandidate(null);
    }
  };

  // Update handler

  const handleUpdate = (car) => setSelectedCar(car);

  const handleUpdateSubmit = (updatedCarData) => {
    setCars((prev) =>
      prev.map((car) => (car._id === updatedCarData._id ? updatedCarData : car))
    );
    toast.success("Car updated successfully!");
    setSelectedCar(null);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading listings...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  const total = cars.length;
  const available = cars.filter((c) => c.status === "available").length;
  const booked = cars.filter((c) => c.status === "booked").length;

  return (
    <section className="min-h-screen p-8 relative bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden py-20">
      <style>{`
   .floating-orb {
          animation: float 15s ease-in-out infinite;
        }
     @keyframes float {
    0% { transform: translate(0, 0); }
   50% { transform: translate(20px, 30px); }
       100% { transform: translate(0, 0); }
   }
   `}</style>

      {/* Floating Orbs */}

      <div className="absolute top-0 left-0 w-full h-full z-0">
        <div className="floating-orb absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 opacity-20 -top-52 -left-24 blur-[80px]"></div>
        <div className="floating-orb absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-500 to-pink-700 opacity-20 -bottom-64 -right-48 blur-[80px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5">
        {/* Header */}

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-700 uppercase tracking-wide mb-4">
            My Listings ({cars.length})
          </h1>
          <div className="w-20 h-1 mx-auto bg-gradient-to-r from-yellow-400 to-pink-500 rounded mb-4"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Manage all your listed vehicles, fetched live from your server.{" "}
          </p>
        </div>

        {/* Stats section*/}

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              {total}
            </div>
            <div className="text-gray-400 uppercase tracking-wide">
              Total Listings
            </div>
          </div>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <div className="text-4xl font-bold text-green-500 mb-2">
              {available}
            </div>
            <div className="text-gray-400 uppercase tracking-wide">
              Availables
            </div>
          </div>
          <div className="bg-gray-800 bg-opacity-70 backdrop-blur-md border border-white/10 rounded-2xl p-8 text-center">
            <div className="text-4xl font-bold text-red-500 mb-2">{booked}</div>
            <div className="text-gray-400 uppercase tracking-wide">Booked</div>
          </div>
        </div>

        {/* Cars Grid */}

        <div className="grid md:grid-cols-3 gap-10">
          {cars.length > 0 ? (
            cars.map((car) => (
              <div
                key={car._id}
                className={`relative bg-gray-800 bg-opacity-70 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden transition-transform hover:-translate-y-2 ${
                  car.status === "booked" ? "opacity-80" : ""
                }`}
              >
                <div
                  className={`absolute top-5 right-5 px-4 py-2 rounded-full text-sm font-semibold ${
                    car.status === "available"
                      ? "bg-gradient-to-br from-green-500 to-green-700 text-white"
                      : "bg-gradient-to-br from-red-500 to-red-700 text-white"
                  }`}
                >
                  {car.status === "available" ? "Available" : "Booked"}
                </div>

                <img
                  src={car.imageUrl}
                  alt={car.name}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://placehold.co/400x250/222/FFF?text=No+Image";
                  }}
                />

                <div className="p-6 relative">
                  <div className="flex justify-between items-start mb-3 flex-col md:flex-row gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {car.name}
                      </h3>
                      <p className="text-gray-400 text-sm">{car.category}</p>
                    </div>
                    <div className="text-yellow-400 font-bold text-lg">
                      ${car.price}/day
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm mb-3">{car.location}</p>
                  <p className="text-gray-500 text-xs mb-4">
                    ID: {car._id.toString().substring(0, 8)}...
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(car)}
                      className="px-3 py-1 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
                    >
                      {" "}
                      Update{" "}
                    </button>
                    <button
                      onClick={() => handleDelete(car)}
                      className="px-3 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-600"
                    >
                      {" "}
                      Delete{" "}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="md:col-span-3 text-center p-10 bg-gray-800 rounded-xl border border-white/10">
              <h2 className="text-2xl text-yellow-400 mb-2">
                No Active Listings
              </h2>
              <p className="text-gray-400">Add a car to see it here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Update Modal */}

      {selectedCar && accessToken && (
        <UpdateCarModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onSubmit={handleUpdateSubmit}
          accessToken={accessToken}
        />
      )}

      {/* Delete Modal */}

      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900/95 border-2 border-red-500/50 rounded-xl p-8 max-w-sm w-full relative shadow-2xl shadow-red-600/20 transition-all duration-300">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500 mb-4">
              {" "}
              ⚠️ System Alert
            </h2>
            <p className="text-gray-300 mb-6 border-b border-gray-700/50 pb-4">
              Are you sure you want to permanently delete{" "}
              <strong>{deleteCandidate.name}</strong>? This action cannot be
              undone.{" "}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-lg text-gray-400 border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                {" "}
                Cancel{" "}
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-700 text-white font-bold shadow-lg shadow-red-600/50 hover:from-red-500 hover:to-pink-600 transition-all duration-300"
              >
                {" "}
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyListings;
