
import React from "react";
import {
   FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
   FaCar,
  FaMapMarkerAlt,
   FaPhone,
   FaEnvelope,
  FaCreditCard,
  FaShieldAlt,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; 

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    const successMessage = document.getElementById("successMessage");
    e.target.email.value = "";
    successMessage.classList.remove("hidden");
    successMessage.classList.add("flex");
    setTimeout(() => {
      successMessage.classList.add("hidden");
      successMessage.classList.remove("flex");
    }, 3000);
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#111] to-[#000] overflow-hidden py-16 text-white">

      {/*  Background Orb */}

      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#FFD700] to-[#FF69B4] top-[-100px] left-[-100px] opacity-20 blur-[100px]"></div>
        <div className="absolute w-[350px] h-[350px] rounded-full bg-gradient-to-br from-[#FF69B4] to-[#FF1493] bottom-[-150px] right-[-150px] opacity-20 blur-[100px]"></div>
      </div>

      {/* Footer  */}

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Company Column */}

          <div className="lg:col-span-1">
            <div className="flex items-center mb-5">
         <div className="w-14 h-14 bg-gradient-to-br from-[#FFD700] to-[#FF69B4] rounded-lg flex items-center justify-center shadow-lg mr-4">
                <FaCar className="text-black text-2xl" />
        </div>
 <h2 className="text-2xl font-bold bg-gradient-to-r from-[#FFD700] to-[#FF69B4] bg-clip-text text-transparent font-serif">  RentWheels </h2>
      </div>
   <p className="text-gray-300 text-sm mb-6">
  Experience luxury like never before with our premium car rental services. Drive your dreams with style and sophistication.  </p>
     <div className="flex gap-3">
      <a href="#" className="w-9 h-9 rounded-full bg-[rgba(30,30,30,0.7)] flex items-center justify-center text-gray-400 hover:text-[#3b5998] transition-all"><FaFacebookF /></a>

     <a href="#" className="w-9 h-9 rounded-full bg-[rgba(30,30,30,0.7)] flex items-center justify-center text-gray-400 hover:text-gray-700 transition-all"><FaXTwitter /></a>

    <a href="#" className="w-9 h-9 rounded-full bg-[rgba(30,30,30,0.7)] flex items-center justify-center text-gray-400 hover:text-[#E1306C] transition-all"><FaInstagram /></a>

    <a href="#" className="w-9 h-9 rounded-full bg-[rgba(30,30,30,0.7)] flex items-center justify-center text-gray-400 hover:text-[#0077b5] transition-all"><FaLinkedinIn /></a>

    <a href="#" className="w-9 h-9 rounded-full bg-[rgba(30,30,30,0.7)] flex items-center justify-center text-gray-400 hover:text-[#FF0000] transition-all"><FaYoutube /></a>

            </div>
          </div>

          {/* Services */}

          <div>
    <h3 className="text-[#FFD700] font-semibold text-lg mb-3 relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-gradient-to-r after:from-[#FFD700] after:to-[#FF69B4]">  Our Services </h3>
    <ul className="space-y-2 text-sm text-gray-400">
    {["Luxury Cars", "Sports Cars", "SUVs", "Exotic Cars", "Classic Cars"].map((item, i) => (
         <li key={i}>
       <a href="#" className="hover:text-[#FFD700] transition">{item}</a>
          </li>
        ))}
            </ul>
          </div>

          {/* Support */}

     <div>
   <h3 className="text-[#FFD700] font-semibold text-lg mb-3 relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-gradient-to-r after:from-[#FFD700] after:to-[#FF69B4]">  Support </h3>
    <ul className="space-y-2 text-sm text-gray-400">
    {["Help Center", "Contact Us", "FAQ", "Terms of Service", "Privacy Policy"].map((item, i) => (
      <li key={i}>
       <a href="#" className="hover:text-[#FFD700] transition">{item}</a>
      </li>
       ))}
      </ul>
          </div>

          {/* Newsletter */}

    <div>
   <h3 className="text-[#FFD700] font-semibold text-lg mb-3 relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-10 after:h-[2px] after:bg-gradient-to-r after:from-[#FFD700] after:to-[#FF69B4]"> Stay Updated </h3>
   <p className="text-gray-400 text-sm mb-3">Subscribe for exclusive offers & updates.</p>
    <form className="flex" onSubmit={handleSubscribe}>
      <input
       type="email"
        name="email"
 placeholder="Your email"
      required
        className="flex-1 px-4 py-2 rounded-l-full bg-[rgba(30,30,30,0.7)] text-white text-sm focus:outline-none"
     />
         <button
      type="submit"
      className="px-4 py-2 rounded-r-full bg-gradient-to-br from-[#FFD700] to-[#FF69B4] text-black text-sm font-semibold"
      >  Subscribe </button>
   </form>
    <div id="successMessage" className="hidden mt-3 p-2 rounded bg-green-100 border border-green-300 text-green-600 text-sm items-center">
    <FaShieldAlt className="mr-2" /> Thank you for subscribing!!  </div>
          </div>
        </div>

        {/* Bottom Section*/}

 <div className="border-t border-[rgba(255,255,255,0.1)] pt-6 text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
      <div className="flex flex-wrap justify-center gap-4">
       <div className="flex items-center"><FaMapMarkerAlt className="text-[#FFD700] mr-2" />123 Luxury Avenue</div>

       <div className="flex items-center"><FaPhone className="text-[#FFD700] mr-2" />+1 (555) 123-4567</div>

     <div className="flex items-center"><FaEnvelope className="text-[#FFD700] mr-2" />contact@rentwheels.com</div>

    </div>

   <div className="flex flex-wrap justify-center gap-4">
      <div className="flex items-center"><FaCreditCard className="text-[#FFD700] mr-2" />Secure Payments</div>
       <div className="flex items-center"><FaShieldAlt className="text-[#FFD700] mr-2" />Trusted Service</div>
   </div>
      </div>
      <p className="text-center text-gray-500 mt-6 text-xs">
            © 2025 RentWheels. All rights reserved.
    </p>
      </div>
  </div>
    </footer>
  );
};

export default Footer;
