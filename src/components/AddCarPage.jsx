import React, { useState } from "react";
import { getAuth } from "firebase/auth"; 

const AddCarPage = ({ onNewCarAdded }) => {
  const [formData, setFormData] = useState({
    carName: "",
    rentPrice: "",
    category: "",
    location: "",
    imageUrl: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const auth = getAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required field
      
      if (!formData.carName || !formData.rentPrice || !formData.category || !formData.location || !formData.imageUrl) {
        showToast("Please fill all required fields!", "error");
        setLoading(false);
        return;
      }

      //  Firebase user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        showToast("User not logged in. Please login first!", "error");
        setLoading(false);
        return;
      }

      // Firebase token
      const accessToken = await currentUser.getIdToken();

      const response = await fetch("http://localhost:3000/api/cars", {
   method: "POST",
   headers: {
   "Content-Type": "application/json",
  email: currentUser.email, 
   Authorization: `Bearer ${accessToken}`,  
        },
    body: JSON.stringify({
    name: formData.carName,
   price: formData.rentPrice,
     category: formData.category,
     location: formData.location,
     imageUrl: formData.imageUrl,
     description: formData.description,
        }),
      });

  if (!response.ok) throw new Error("Failed to add car");

   const result = await response.json();
   showToast("Car successfully listed! Your vehicle is now available on RentWheels.", "success");

     setFormData({
     carName: "",
       rentPrice: "",
    category: "",
     location: "",
     imageUrl: "",
       description: "",
      });

    if (typeof onNewCarAdded === "function") onNewCarAdded(result.id);

    } catch (err) {
    console.error(err);
    showToast("Failed to list car. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black overflow-x-hidden">

   <div className="absolute inset-0 overflow-hidden -z-10">
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full blur-[80px] top-[-200px] left-[-100px] animate-float"></div>
     <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-pink-500 to-pink-700 rounded-full blur-[80px] bottom-[-250px] right-[-200px] animate-float animation-delay-5000"></div>
      </div>

      {/* Content section */}

    <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        {/* Header */}

      <div className="text-center mb-20 animate-fadeInUp">
       <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold uppercase bg-gradient-to-r from-yellow-400 via-pink-500 to-pink-700 bg-clip-text text-transparent tracking-wide mb-5">
            List a New Rental Vehicles
      </h1>
   <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-pink-500 mx-auto rounded mb-5"></div>
      <p className="text-gray-400 text-lg max-w-xl mx-auto">  Maximize your earnings by sharing your vehicle with the RentWheels communitys.
     </p>
        </div>

        {/* Form */}
        
        <div className="bg-gray-800/70 backdrop-blur-md border border-white/10 rounded-2xl p-10 shadow-2xl animate-fadeInUp">
          <form onSubmit={handleSubmit} className="space-y-10">


        <div className="border-b border-white/10 pb-10 space-y-5">
         <h2 className="text-xl font-bold text-white flex items-center">
                <i className="fas fa-shield-alt mr-3 text-yellow-400"></i> Provider Information
      </h2>
        <div className="grid gap-6 md:grid-cols-2">
                <div>
      <label className="block text-gray-300 font-semibold mb-1">
           <i className="fas fa-user mr-1"></i> Provider Account ID <span className="text-red-500">*</span>
       </label>
            <input
           type="text"
           value="Linked ID: mock-user-p..."
                    readOnly
           className="w-full p-4 bg-gray-900/80 border border-white/10 rounded-lg text-white cursor-not-allowed"
                  />
                </div>
                <div>
       <label className="block text-gray-300 font-semibold mb-1">
                    <i className="fas fa-envelope mr-1"></i> Account Email Status <span className="text-red-500">*</span>
                  </label>
     <input
                    type="text"
                    value="Email is Linked (Confidential)"
                    readOnly
       className="w-full p-4 bg-gray-900/80 border border-white/10 rounded-lg text-white cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Specs */}

            <div className="border-b border-white/10 pb-10 space-y-5">
              <h2 className="text-xl font-bold text-white flex items-center">
                <i className="fas fa-car mr-3 text-yellow-400"></i> Vehicle Specifications
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    <i className="fas fa-car mr-1"></i> Car Name/Model <span className="text-red-500">*</span>
                  </label>
     <input
                    type="text"
                    id="carName"
                    value={formData.carName}
                    onChange={handleChange}
                    placeholder="car-name"
                    required
         className="w-full p-4 bg-gray-900/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring focus:ring-yellow-400/20"
                  />
                </div>
                <div>
       <label className="block text-gray-300 font-semibold mb-1">
          <i className="fas fa-dollar-sign mr-1"></i> Daily Rental Prices (USD) <span className="text-red-500">*</span>
                  </label>
     <input
          type="number"
           id="rentPrice"
              value={formData.rentPrice}
                    onChange={handleChange}
           placeholder="car-price"
            min="1"
                    required
         className="w-full p-4 bg-gray-900/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring focus:ring-yellow-400/20"
                  />
                </div>
                <div>
    <label className="block text-gray-300 font-semibold mb-1">
       <i className="fas fa-tag mr-1"></i> Vehicle Category <span className="text-red-500">*</span>
        </label>
                  <select
       id="category"
          value={formData.category}
         onChange={handleChange}
           required
     className="w-full p-4 bg-gray-900/80 border border-white/10 rounded-lg text-white cursor-pointer focus:outline-none focus:border-yellow-400 focus:ring focus:ring-yellow-400/20"
                  >
        <option value="">Select a category</option>
       <option value="Sedan">Sedan</option>
        <option value="SUV">SUV</option>
         <option value="Hatchback">Hatchback</option>
        <option value="Coupe">Coupe</option>
       <option value="Truck">Truck</option>
        <option value="Luxury">Luxury</option>
        <option value="Electric">Electric</option>
         </select>
         </div>
    </div>
       </div>

            {/* Location & Media */}

            <div className="border-b border-white/10 pb-10 space-y-5">
              <h2 className="text-xl font-bold text-white flex items-center">
                <i className="fas fa-map-marker-alt mr-3 text-yellow-400"></i> Availability and Media
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    <i className="fas fa-map-marker-alt mr-1"></i> Primary Pickup Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Area"
                    required
                    className="w-full p-4 bg-gray-900/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring focus:ring-yellow-400/20"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">
                    <i className="fas fa-image mr-1"></i> High-Quality Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="Link to a clear, hosted image of the car"
                    required
                    className="w-full p-4 bg-gray-900/80 border border-white/10 rounded-lg text-white focus:outline-none focus:border-yellow-400 focus:ring focus:ring-yellow-400/20"
                  />
                </div>
              </div>
            </div>

            {/* Description */}

            <div className="space-y-5">
              <h2 className="text-xl font-bold text-white flex items-center">
                <i className="fas fa-book-open mr-3 text-yellow-400"></i> Detailed Description (Optional)
              </h2>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Highlight key features, special terms, and unique selling points."
                className="w-full p-4 min-h-[120px] bg-gray-900/80 border border-white/10 rounded-lg text-white resize-vertical focus:outline-none focus:border-yellow-400 focus:ring focus:ring-yellow-400/20"
              ></textarea>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="w-full p-5 bg-gradient-to-br from-yellow-400 to-pink-500 text-black font-bold rounded-lg flex justify-center items-center gap-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div> : <i className="fas fa-paper-plane"></i>}
              {loading ? "Processing Listing..." : "Finalize and List Vehicle"}
            </button>
          </form>
        </div>
      </div>

      {/* Toasts */}

      <div className="fixed top-5 right-5 flex flex-col gap-4 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-3 p-4 rounded-lg min-w-[300px] shadow-lg text-white font-semibold ${
              t.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <i className={`fas ${t.type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`}></i>
            <span>{t.message}</span>
            <button onClick={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes float {
            0%,100% { transform: translate(0,0) scale(1); }
            33% { transform: translate(30px,-30px) scale(1.1); }
            66% { transform: translate(-20px,20px) scale(0.9); }
          }
          .animate-float { animation: float 25s infinite ease-in-out; }
          .animate-fadeInUp { animation: fadeInUp 1s ease-out both; }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animation-delay-5000 { animation-delay: 5s; }
        `}
      </style>
    </div>
  );
};

export default AddCarPage;
