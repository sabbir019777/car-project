import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaUser,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//  Backend API route
const API_URL = "http://localhost:3000/api/cars/top-browse";

const BrowseCarsPage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch cars from MongoDB
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
    const response = await axios.get(API_URL);
        const processedCars = response.data.map((car) => ({
          id: car._id,
          name: car.name || "Unnamed Car",
          model: car.model || "Unknown Model",
          price: car.price || 0,
          imageUrl:
     car.imageUrl && car.imageUrl.trim() !== ""
              ? car.imageUrl
       : "https://via.placeholder.com/400x250?text=No+Image",
          category: car.category || "Uncategorized",
     providerName: car.providerName || "Unknown Provider",
          location: car.location || "Unknown",
        }));
        setCars(processedCars);
      } catch (err) {
        console.error(" Failed to fetch browse car data:", err);
      } finally {
        setLoading(false);
      }
    };

    const checkLogin = () => {
      const user = localStorage.getItem("userLoggedIn") === "true";
      setIsLoggedIn(user);
    };

    checkLogin();
    fetchCars();
    window.addEventListener("storage", checkLogin);

    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  //  Filter cars

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === "All" || car.category === category)
  );

  //  Filter apply button

  const applyFilters = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  // Clear all filters

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All");
  };

  //  View Details Button Logic

  const viewDetails = (car) => {
    const user = localStorage.getItem("userLoggedIn") === "true";
    if (!user) {
      navigate("/login", { state: { from: `/car/${car.id}` } });
    } else {
      navigate(`/car/${car.id}`, { state: { car } });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">

      {/* Floating Orb */}

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 blur-3xl opacity-20 -top-52 -left-24 animate-[float_25s_ease-in-out_infinite]"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-500 to-pink-700 blur-3xl opacity-20 -bottom-60 -right-48 animate-[float_25s_ease-in-out_infinite_5s]"></div>
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-5 py-20">

        {/* Header */}

    <div className="text-center mb-20 animate-fadeInUp">
  <h1 className="font-playfair text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-700 uppercase tracking-wider"> Browse Our Fleet
          </h1>
    <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-pink-500 mx-auto rounded mt-5 mb-5"></div>
    <p className="text-gray-300 max-w-xl mx-auto">
     Discover the perfect ride for your next journey from our extensive collections of premium rental vehicles.
          </p>
        </div>

        {/*  Search & Filter */}

        <div className="max-w-3xl mx-auto mb-20 animate-fadeInUp">
     <div className="flex flex-wrap gap-5 bg-gray-800/70 backdrop-blur-lg border border-gray-700 rounded-2xl p-7 shadow-lg">
    <div className="flex-1 min-w-[250px] relative">
        <input
                type="text"
                placeholder="Search by car name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 rounded-xl bg-gray-700/80 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
       <FaSearch className="absolute right-5 top-1/2 -translate-y-1/2 text-yellow-400" />
            </div>

            <div className="min-w-[200px]">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
        className="w-full px-5 py-3 rounded-xl bg-gray-700/80 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
         <option value="All">All Categories</option>
       <option value="Electric">Electric</option>
      <option value="Luxury">Luxury</option>
        <option value="Sedan">Sedan</option>
       <option value="SUV">SUV</option>
       <option value="Hatchback">Hatchback</option>
     </select>
            </div>

            <button
              onClick={applyFilters}
       className="px-7 py-3 bg-gradient-to-br from-yellow-400 to-pink-500 text-black font-semibold rounded-xl shadow-lg hover:translate-y-[-2px] transition-all"
            >  Apply Filters
            </button>
          </div>
        </div>

        {/*  Loading */}

        {loading && (
          <div className="text-center py-16">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        )}

        {/*  Cars Grid */}

    {!loading && filteredCars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
            {filteredCars.map((car) => (
              <div
                key={car.id}
         className="relative bg-gray-800/70 backdrop-blur-lg border border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform"
              >
                <div className="absolute top-5 left-5 px-3 py-1 bg-black/70 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                  {car.category}
                </div>

  <img
        src={car.imageUrl}
         alt={car.name}
           className="w-full h-56 object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
          onClick={() => viewDetails(car)}
      />

                <div className="p-6">
        <div className="flex justify-between mb-3">
                    <div>
              <h3 className="text-white font-bold text-lg">{car.name}</h3>
         <p className="text-gray-400 text-sm">{car.model}</p>
                </div>
           <div className="text-yellow-400 font-bold text-lg">
                      ${car.price}
             <span className="text-gray-400 text-sm">/day</span>
                    </div>
                  </div>

          <div className="mb-4">
        <div className="flex items-center text-gray-300 text-sm mb-1">
      <FaUser className="mr-2 text-yellow-400" />
                      Provider: {car.providerName}
         </div>
        <div className="flex items-center text-gray-300 text-sm">
    <FaMapMarkerAlt className="mr-2 text-yellow-400" />
                      Location: {car.location}
           </div>
                  </div>

        <button
        onClick={() => viewDetails(car)}
          className="w-full py-3 rounded-xl font-semibold text-sm uppercase tracking-wide bg-gradient-to-br from-yellow-400 to-pink-500 text-black shadow-lg hover:-translate-y-1 transition-all"
        >  View Details
     </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/*  Empty State */}

    {!loading && filteredCars.length === 0 && (
     <div className="text-center p-16 bg-gray-800/70 backdrop-blur-lg border border-gray-700 rounded-2xl max-w-xl mx-auto">
            <div className="text-yellow-400 text-4xl mb-4">
     <FaMapMarkerAlt className="mx-auto" />
            </div>
       <h2 className="text-white text-2xl font-bold mb-3">No Cars Found</h2>
       <p className="text-gray-400 mb-5">
    We couldn't find any vehicles matching your criteria. Try adjusting your search or filters!
            </p>
      <button
              onClick={clearFilters}
       className="px-7 py-3 bg-gradient-to-br from-yellow-400 to-pink-500 text-black font-semibold rounded-xl shadow-lg hover:-translate-y-1 transition-all"
        > Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseCarsPage;
