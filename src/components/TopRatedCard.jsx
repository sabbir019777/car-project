import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { auth } from "../Firebase/Firebase.config";
import axios from "axios";

const API_URL = "http://localhost:3000/api/cars/top-rated";

const TopRatedCard = () => {
  const navigate = useNavigate();
 const [cars, setCars] = useState([]);
 const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [appliedSearch, setAppliedSearch] = useState("");

  useEffect(() => {
    const fetchCars = async () => {
      try {
  const response = await axios.get(API_URL);

      const processedCars = response.data.map((car) => ({
    id: car._id,
   name: car.name,
      pricePerDay: `$${car.price} / day`,
       image: car.imageUrl,
      description: `${car.model} | ${car.providerName}`,
        category: car.category,
      location: car.location,
          status: car.status,
      features: [car.category, car.location, car.status],
        }));

     setCars(processedCars);
    setLoading(false);
   } catch (err) {
     console.error("❌ Failed to fetch car data:", err);
   setError("Failed to load cars. Please ensure backend server is running on port 3000.");
     setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleBookNow = (car) => {
    if (auth.currentUser) {
    setCars((prev) => prev.filter((c) => c.id !== car.id));
    navigate("/my-bookings", { state: { bookedCar: car } });
    } else {
      navigate("/login");
    }
  };

  const handleApplySearch = () => {
    setAppliedSearch(searchTerm);
  };

  const filteredCars = cars.filter((car) => {
    const matchesCategory =
  category === "All" || car.category?.toLowerCase() === category.toLowerCase();

   const matchesSearch = appliedSearch
   ? car.name?.toLowerCase().includes(appliedSearch.toLowerCase())
 : car.name?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
 <div className="relative bg-gray-900 min-h-screen text-white flex justify-center items-center">
  <p className="text-xl text-yellow-400">Loading Top Rated Cars...</p>
      </div>
    );
  }

  if (error) {
    return (
   <div className="relative bg-gray-900 min-h-screen text-white flex flex-col justify-center items-center p-5">
    <p className="text-xl text-red-500 mb-4">{error}</p>
   <p className="text-gray-400 text-center"> Please make sure the backend is running and the port is 3000.
     </p>
      </div>
    );
  }

  return (
   <div className="relative bg-gray-900 min-h-screen text-white overflow-hidden">

      {/*  Floating Orbs */}

   <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
   <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-yellow-400 to-pink-500 blur-3xl opacity-20 -top-52 -left-24 animate-[float_25s_ease-in-out_infinite]"></div>
    <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-pink-500 to-pink-700 blur-3xl opacity-20 -bottom-60 -right-48 animate-[float_25s_ease-in-out_infinite_5s]"></div>
    </div>

   <div className="relative z-10 max-w-[1400px] mx-auto px-5 py-20">

        {/*  Header */}

     <div className="text-center mb-20 animate-fadeInUp">
   <h1 className="font-playfair text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-700 uppercase tracking-wider"> Top Rated Cars
    </h1>
    <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-pink-500 mx-auto rounded mt-5 mb-5"></div>
 <p className="text-gray-300 max-w-xl mx-auto"> Browse our top-rated luxury and performance vehicles loved by our customers. </p>
   </div>

        {/* Search & Filter */}

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
       <option value="Sports">Sports</option>
              </select>
            </div>

            {/* Apply Search Button */}

       <div className="min-w-[120px] flex items-center">
       <button
        onClick={handleApplySearch}
  className="bg-gradient-to-r from-amber-400 to-rose-500 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-amber-500/30 text-sm"
     >   Apply </button>
      </div>
     </div>
    </div>


        {/* Top Rated Car section */}

  <div className="space-y-16 relative z-10">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
    <AnimatePresence>
    {filteredCars.length === 0 && (
  <p className="col-span-full text-center text-gray-400 text-lg">  No car found matching your criteria.</p>
 )}

    {filteredCars.map((car) => (
        <motion.div
      key={car.id}
                  layout
     initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
       exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1.02 }}
     className="relative group w-full flex justify-center"
        >
      <div className="relative bg-gray-800/70 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700 shadow-lg w-full max-w-4xl">
      <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden w-full">
    <img
           src={car.image}
      alt={car.name}
     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
         />
   </div>
    <div className="p-8 w-full">
      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-amber-300">
     {car.name}
      </h3>
    <p className="text-gray-400 text-base mb-4">{car.description}</p>
    <div className="flex flex-wrap gap-2 mb-4">
     {car.features.slice(0, 3).map((f, idx) => (
    <span
           key={idx}
           className="text-sm bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full"
        >
     {f}
       </span>
      ))}
      </div>
    <div className="flex justify-between items-center">
      <p className="text-amber-400 font-bold text-lg">{car.pricePerDay}</p>
 <motion.button
     whileHover={{ scale: 1.05 }}
         whileTap={{ scale: 0.95 }}
       onClick={() => handleBookNow(car)}
     className="bg-gradient-to-r from-amber-400 to-rose-500 text-gray-900 px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-amber-500/30 text-sm"
    > Book Now </motion.button>
    </div>
       </div>
    </div>
     </motion.div>
   ))}
      </AnimatePresence>
    </div>
    </div>
      </div>
    </div>
  );
};

export default TopRatedCard;
