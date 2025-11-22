import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const MyBookings = () => {
  const location = useLocation();
  const newBookedCar = location.state?.bookedCar;

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("myBookings")) || [];
    setBookings(storedBookings);
  }, []);

  useEffect(() => {
    if (newBookedCar) {
      setBookings((prev) => {
    const exists = prev.some((b) => b.id === newBookedCar.id);
   if (exists) return prev;
   const updatedBookings = [...prev, { ...newBookedCar, status: "Booked" }];
      localStorage.setItem("myBookings", JSON.stringify(updatedBookings));
        return updatedBookings;
      });
    }
  }, [newBookedCar]);

  const handleCancel = (id, carName) => {
  Swal.fire({
    title: `Cancel booking for ${carName}?`,
   text: "This action cannot be undone.",
    icon: "warning",
   showCancelButton: true,
  confirmButtonColor: "#d33",
   cancelButtonColor: "#3085d6",
   confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
   setBookings((prev) => {
     const updatedBookings = prev.filter((b) => b.id !== id);
     localStorage.setItem("myBookings", JSON.stringify(updatedBookings));
     return updatedBookings;
      });
    Swal.fire("Cancelled!", `${carName} booking has been cancelled.`, "success");
      }
    });
  };

  useEffect(() => {
    document.title = "My Bookings - RentWheels";
  }, []);

  return (
    <section className="min-h-screen bg-gray-900 text-white px-10 pt-24 pb-10">

      {/* ✅ Heading */}

 <h1 className="text-5xl font-extrabold mb-10 text-center text-amber-400 drop-shadow-lg"> My Booking
 </h1>

      {/* ✅ Bookings List */}

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <AnimatePresence>
    {bookings.length === 0 ? (
    <p className="col-span-full text-center text-gray-400 text-lg">  No bookings found.
    </p>
   ) : (
     bookings.map((b) => (
    <motion.div
    key={b.id}
   layout
     initial={{ opacity: 0, scale: 0.95 }}
     animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
     whileHover={{ scale: 1.02 }}
     className="relative group w-full"
   >
   <div className="relative bg-gray-800/70 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700 shadow-lg hover:shadow-amber-400/10 transition-all duration-300">
                  
                  {/* Car Img */}

    <div className="relative h-64 overflow-hidden">
   <img
    src={b.image}
      alt={b.name}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

                  {/* Booked Badge */}

  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 bg-red-500 text-white">  Booked
     </div>

                  {/* Car Details */}

  <div className="p-6">
     <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-amber-300">
     {b.name}
      </h3>
       <p className="text-gray-400 text-sm mb-3">{b.description}</p>

      <div className="flex flex-wrap gap-2 mb-3">
       {b.features?.slice(0, 3)?.map((f, idx) => (
       <span
      key={idx}
      className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full"
          >
         {f}
     </span>
     ))}
        </div>

       <div className="flex justify-between items-center">
     <p className="text-amber-400 font-bold text-base">
          {b.pricePerDay}
       </p>
       <button
       onClick={() => handleCancel(b.id, b.name)}
        className="bg-red-600 px-4 py-2 rounded-full font-semibold shadow-md hover:bg-red-700 hover:shadow-red-500/30 text-sm transition-all"
        >  Cancel   </button>
        </div>
      </div>
      </div>
      </motion.div>
      ))
    )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default MyBookings;
