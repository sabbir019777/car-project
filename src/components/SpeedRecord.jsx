// src/components/SpeedRecord.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const videos = [
  { url: "https://cdn.pixabay.com/video/2022/03/26/111961-692674425_large.mp4" },

  { url: "https://cdn.pixabay.com/video/2025/02/03/256064_large.mp4" },

  { url: "https://cdn.pixabay.com/video/2021/05/27/75456-556034317_large.mp4" },

  { url: "https://cdn.pixabay.com/video/2022/02/04/106722-673786473_large.mp4" },

  { url: "https://cdn.pixabay.com/video/2023/09/21/181537-866999852_large.mp4" },
];

const SpeedRecord = ({ user }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = videos.length;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    const interval = setInterval(() => nextSlide(), 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[80vh] md:h-[70vh] sm:h-[60vh] overflow-hidden bg-black font-roboto">

      {/* Google Fonts */}

   
    <link
    
    href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet"
      />

  
    <AnimatePresence mode="wait">
    <motion.div
    key={currentSlide}
      className="absolute top-0 left-0 w-full h-full"
      initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {/* Vdo */}

   <motion.video
     key={videos[currentSlide].url}
      autoPlay
     muted
    loop
      playsInline
   className="w-full h-full object-cover brightness-[0.9] sm:brightness-[0.6]"
  initial={{ scale: 1.1 }}
     animate={{ scale: 1 }}
     transition={{ duration: 10, ease: "easeOut" }}
          >
        <source src={videos[currentSlide].url} type="video/mp4" />
     </motion.video>

 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

          {/* Text Content */}

     <motion.div
    className="absolute bottom-20 md:bottom-16 sm:bottom-12 left-16 md:left-12 sm:left-6 text-white z-20"
       initial={{ opacity: 0, y: 40 }}
   animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          >
       <motion.h1
     className="text-sm md:text-base sm:text-sm font-light uppercase tracking-[4px] text-white/70 mb-2 font-playfair"
      initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
           transition={{ duration: 1, delay: 0.6 }}
  >   A RECORD-BREAKINGS
  </motion.h1>
       <motion.h2
    className="text-2xl md:text-3xl sm:text-xl font-thin tracking-[6px] uppercase text-white drop-shadow-lg font-playfair"
       initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.9 }}
       >   FORCE OF NATURE
    </motion.h2>

    <motion.div
     className="mt-4 w-[60px] h-[2px] bg-white/40 rounded-full"
       initial={{ width: 0, opacity: 0 }}
        animate={{ width: 60, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
            />
  </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}\
      <button
        onClick={prevSlide}
   className="absolute left-5 md:left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 md:p-2 rounded-full text-white z-30 transition-all"
      >
    <ChevronLeft size={26} />
      </button>
      <button
        onClick={nextSlide}
     className="absolute right-5 md:right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 md:p-2 rounded-full text-white z-30 transition-all"
      >
      <ChevronRight size={26} />
      </button>

      {/* Dots */}

    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3 z-30">
     {videos.map((_, index) => (
      <button
       key={index}
       onClick={() => setCurrentSlide(index)}
       className={`transition-all duration-500 ${
       currentSlide === index
       ? "w-6 h-2 md:w-5 md:h-1 bg-white rounded-md"
     : "w-2 h-2 md:w-1 md:h-1 bg-white/40 rounded-full"
       }`}
     />
        ))}
      </div>
    </div>
  );
};

export default SpeedRecord;
