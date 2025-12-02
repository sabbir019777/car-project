import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaMapMarkerAlt, FaDollarSign, FaCarSide } from "react-icons/fa";

// Sample Similar Cars

const similarCarsMock = [
  {
    id: "c003",
    name: "Koenigsegg Jesko",
    price: 800,
    imageUrl:
    "https://flavoredtimes.com/wp-content/uploads/2024/12/koenigsegg.jpg",
  },
  {
    id: "c011",
    name: "Aston Martin Valkyrie",
    price: 1180,
    imageUrl:
     "https://www.carscoops.com/wp-content/uploads/2024/02/Aston-martin-Valkyrieaa.jpg",
  },
  {
    id: "c015",
    name: "SSC Tuatara",
    price: 1150,
    imageUrl:
      "https://static0.carbuzzimages.com/wordpress/wp-content/uploads/2025/02/67be3d1c79f883d4efb3ae42_hk-88-of-234-1.jpg?w=1600&h=900&fit=crop",
  },
];

const CarDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const car = location.state?.car;

  if (!car) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-5">
        <h1 className="text-3xl font-bold mb-5">Car Not Found</h1>
        <p className="text-gray-400 mb-5 text-center">
          Looks like you accessed this page directly without selecting a car.
        </p>
        <button
          onClick={() => navigate("/browse-cars")}
          className="px-6 py-3 bg-gradient-to-br from-yellow-400 to-pink-500 text-black rounded-xl font-semibold hover:scale-105 transition"
        >
          Back to Browse
        </button>
      </div>
    );
  }

  // Add Car Button Click Handler

  const handleAddCar = () => {
    const userLoggedIn = localStorage.getItem("userLoggedIn") === "true";

    if (userLoggedIn) {

      navigate("/add-car", { state: { car } });
    } else {
     
      navigate("/login", { state: { from: `/add-car` } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 pb-20 px-5">
      <div className="max-w-6xl mx-auto">

        {/* Car Main Section */}

        <div className="flex flex-col lg:flex-row gap-10 bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-lg p-6 animate-fadeInUp">

          {/* Left: Car Image */}

    <div className="lg:w-1/2 flex justify-center items-center">
      <img
              src={car.imageUrl}
              alt={car.name}
      className="rounded-2xl w-full h-full object-cover shadow-xl hover:scale-105 transition-transform"
            />
          </div>

          {/* Right: Car Info */}

          <div className="lg:w-1/2 flex flex-col justify-between">
            <div>
      <h1 className="text-4xl font-bold mb-2">{car.name}</h1>
      <p className="text-gray-400 text-lg mb-4">{car.model}</p>

        <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 text-gray-300">
       <FaUser className="text-yellow-400" /> {car.providerName}
                </div>
       <div className="flex items-center gap-2 text-gray-300">
         <FaMapMarkerAlt className="text-yellow-400" /> {car.location}
                </div>
                <div className="flex items-center gap-2 text-gray-300">
         <FaDollarSign className="text-yellow-400" /> ${car.price}/day
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCarSide className="text-yellow-400" /> {car.category}
                </div>
              </div>

     <p className="text-gray-300 mb-6">
    Rent this premium {car.category} car and enjoy a smooth, comfortable ride. Perfect for city drives, long journeys, or weekend adventures. Provided by {car.providerName}, a trusted rental partner.
              </p>
            </div>

            {/* Action Buttons */}

     <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => navigate(-1)}
     className="px-6 py-3 bg-gradient-to-br from-yellow-400 to-pink-500 text-black rounded-xl font-semibold hover:scale-105 transition"
       >  Back </button>

       {/* Add Car Button with login check */}

     <button
         onClick={handleAddCar}
      className="px-6 py-3 bg-gradient-to-br from-yellow-400 to-pink-500 text-black rounded-xl font-semibold hover:scale-105 transition"
       >  Add Car
      </button>
            </div>
          </div>
        </div>

        {/* Similar Cars section*/}

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-yellow-400">
            Similar Cars You Might Likes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {similarCarsMock.map((c) => (
              <div
                key={c.id}
         className="bg-gray-800/70 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition-transform"
              >
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg">{c.name}</h3>
                  <p className="text-yellow-400 font-bold text-md">${c.price}/day</p>
                  <button
                    onClick={() => navigate("/browse-cars")}
              className="mt-3 w-full py-2 bg-gradient-to-br from-yellow-400 to-pink-500 text-black rounded-xl font-semibold hover:scale-105 transition"
          > View Cars
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsPage;
