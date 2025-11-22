import React from "react";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { auth } from "../Firebase/Firebase.config";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleAddCar = () => {
    if (auth.currentUser) {
    
      navigate("/add-car");
    } else {

   navigate("/login", { state: { from: "/add-car" } });
    }
  };

  const handleBrowse = () => navigate("/browse-cars");

  return (
    <section className="relative bg-gray-900 text-white overflow-hidden mt-[-35px]">
      <div className="absolute inset-0">
   <img
    src="https://www.rolls-roycemotorcars.com/content/dam/rrmc/marketUK/rollsroycemotorcars_com/2-1-1-103-ex/page-properties/rolls-royce-103ex-share-image.jpg"
     alt="Luxury Car Background"
    className="w-full h-full object-cover brightness-[1]"
  />
  <div className="absolute inset-0 bg-black/60"></div>
    </div>

      {/* Floating  */}

  <div className="hidden sm:block absolute top-0 left-0 w-full h-full pointer-events-none">
   <div className="absolute w-2 h-2 bg-amber-400 rounded-full animate-ping opacity-30 top-10 left-20"></div>
   <div className="absolute w-3 h-3 bg-pink-500 rounded-full animate-pulse opacity-20 top-32 right-16"></div>
  <div className="absolute w-2 h-2 bg-white rounded-full animate-ping opacity-20 bottom-20 left-32"></div>
  </div>

   <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-20 sm:py-32 flex flex-col lg:flex-row items-center justify-between">

        {/* Left Content */}

 <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1.5 }}
     className="lg:w-1/2 text-center lg:text-left"
   >
    <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
       Drive Your Dream with{" "}
    <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
         <Typewriter
      words={["RentWheels", "Luxury Cars", "Premium Experience"]}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={1500}
              />
     </span>
          </h1>
  <p className="text-gray-200 text-base sm:text-lg md:text-xl mb-8">  Discover top-tier car rentals with trusted provider. Book easily, drive in style, and enjoy every journey with comfort and luxury.
  </p>
   <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
      <motion.button
     whileHover={{ scale: 1.05 }}
       onClick={handleBrowse}
      className="bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-2xl hover:shadow-amber-400 transition-all duration-300"
     >
       Browse Cars
     </motion.button>
      <motion.button
      whileHover={{ scale: 1.05 }}
     onClick={handleAddCar}
    className="border border-amber-500 text-amber-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold shadow-xl hover:bg-amber-500 hover:text-gray-900 transition-all duration-300"
      >  Add Your Car
</motion.button>
     </div>
        </motion.div>

        {/* Right Content */}

  <motion.div
  initial={{ opacity: 0, x: 50 }}
   animate={{ opacity: 1, x: 0 }}
   transition={{ duration: 1.5 }}
    className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center relative"
        >
   <div className="hidden sm:block absolute -top-10 -left-10 w-24 h-24 bg-amber-400 rounded-full opacity-30 animate-pulse"></div>
    <div className="hidden sm:block absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500 rounded-full opacity-20 animate-pulse"></div>
      </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
