import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt, FaQuoteRight, FaHeart } from "react-icons/fa";

const testimonialsData = [
  {
    id: 1,
    name: "Sara Ahmed",
    role: "Frequent Renter",
    image: "https://i.pravatar.cc/150?img=32",
    rating: 5,
    date: "March 15, 2023",
    message:
      "RentWheels made my trip hassle-free! The cars are top-notch and booking is super easy. The luxury collection is unmatched.",
  },
  {
    id: 2,
    name: "John Doe",
    role: "Car Owner & Partner",
    image: "https://i.pravatar.cc/150?img=12",
    rating: 4.8,
    date: "February 28, 2023",
    message:
      "As a car provider, managing my listings is seamless. I love how intuitive the dashboard is. Excellent revenue stream!",
  },
  {
    id: 3,
    name: "Alex Morgan",
    role: "Traveler",
    image: "https://i.pravatar.cc/150?img=45",
    rating: 4.9,
    date: "January 10, 2023",
    message:
      "Amazing service! I booked a luxury SUV and the experience was beyond my expectations. Five stars for service and reliability.",
  },
  {
    id: 4,
    name: "Priya Singh",
    role: "Business Traveler",
    image: "https://i.pravatar.cc/150?img=55",
    rating: 5,
    date: "December 5, 2022",
    message:
      "Perfect for quick trips. The app shows all available cars clearly and booking is instant. Customer support is always responsive.",
  },
  {
    id: 5,
    name: "Michael Brown",
    role: "Weekend Renter",
    image: "https://i.pravatar.cc/150?img=15",
    rating: 4.7,
    date: "November 18, 2022",
    message:
      "The car selection is amazing and the booking process is fast. Highly recommended for anyone needing a premium vehicle!",
  },
  {
    id: 6,
    name: "Emily Clark",
    role: "Frequent Traveler",
    image: "https://i.pravatar.cc/150?img=25",
    rating: 5,
    date: "October 3, 2022",
    message:
      "RentWheels made long trips effortless. Excellent customer support and reliable cars. I won't use anyone else.",
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Testimonials = () => {
  const mouseGradientRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      if (mouseGradientRef.current) {
        mouseGradientRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255, 215, 0, 0.3), transparent 70%)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen py-20 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900 overflow-hidden">

      {/* Background Elements */}

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          ref={mouseGradientRef}
          className="absolute inset-0 opacity-10 transition-all duration-300"
        ></div>
        <div className="absolute w-[400px] h-[400px] -top-52 -left-24 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 opacity-20 animate-[float_25s_infinite_ease-in-out]"></div>
        <div className="absolute w-[500px] h-[500px] -bottom-64 -right-48 rounded-full bg-gradient-to-br from-pink-500 to-fuchsia-600 opacity-20 animate-[float_25s_infinite_ease-in-out] animation-delay-5000"></div>
      </div>

      
      <div className="relative z-10 container mx-auto px-5 max-w-6xl">

        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
     <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 uppercase tracking-wide">  What Our Customers Say  </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-400 to-pink-500 mx-auto my-4 rounded-full"></div>
 <p className="text-gray-300 mt-4 max-w-3xl mx-auto text-base sm:text-lg font-light"> Hear from our satisfied clients who experience excellence with every rides.</p>
  </motion.div>

        {/* Testimonials Grid */}

   <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
      {testimonialsData.map((testi, idx) => (
     <motion.div
              key={testi.id}
              variants={itemVariants}
    className="relative bg-gray-800/70 backdrop-blur-md border border-gray-700 rounded-2xl overflow-hidden p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Top Accent */}

   <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-pink-500 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Quote Icon */}

    <FaQuoteRight className="absolute top-6 right-6 text-amber-500 opacity-20 w-6 h-6" />

              {/* Profile */}

      <div className="flex items-start mb-4">
                <img
                  src={testi.image}
                  alt={testi.name}
     className="w-14 h-14 rounded-full border-2 border-gray-600 group-hover:border-amber-400 mr-4 shadow-lg transition-all duration-300"
       />
         <div>
       <h3 className="text-lg font-bold text-white">{testi.name}</h3>
 <p className="text-sm text-gray-400">{testi.role}</p>
      <p className="text-xs text-gray-500">{testi.date}</p>
      </div>
              </div>

              {/* Rating */}

   <div className="flex items-center gap-1 mb-4">
       {Array.from({ length: 5 }).map((_, i) => {
      if (i < Math.floor(testi.rating)) {
         return <FaStar key={i} className="text-amber-400 w-4 h-4" />;
     } else if (i < testi.rating) {
           return <FaStarHalfAlt key={i} className="text-amber-400 w-4 h-4" />;
       } else {
       return <FaStar key={i} className="text-gray-600 w-4 h-4" />;
                  }
         })}
     <span className="text-xs text-gray-500 ml-1">({testi.rating})</span>
              </div>

              {/* Message */}

    <div className="bg-gray-900/20 p-4 rounded-xl">
        <p className="italic text-gray-300">
        <span className="text-amber-400 mr-1">"</span>
          {testi.message}
   <span className="text-amber-400 ml-1">"</span>
    </p>
              </div>

              {/* Heart Badge */}

      <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center shadow-lg">
     <FaHeart className="text-black w-4 h-4" />
       </div>
       </motion.div>
          ))}
        </motion.div>

        {/* Bottom Accent */}

  <div className="mt-20 flex justify-center">
  <div className="w-48 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent rounded-full"></div>
        </div>
      </div>
  <style>
        {`
       @keyframes float {
       0%, 100% { transform: translate(0,0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-[float_25s_infinite_ease-in-out] {
            animation: float 25s infinite ease-in-out;
          }
          .animation-delay-5000 {
            animation-delay: 5s;
          }
        `}
      </style>
    </section>
  );
};

export default Testimonials;
