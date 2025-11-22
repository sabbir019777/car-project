
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaUserCircle, FaBars, FaTimes, FaAngleDown, FaCarSide,
  FaSignOutAlt, FaHome, FaPlus, FaClipboardList, FaSearch, FaKey,
  FaSun, FaMoon
} from "react-icons/fa";
import Swal from "sweetalert2";

const Navbar = ({ user, logout }) => {

  // Theme state

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.style.backgroundColor = theme === "dark" ? "#1f2937" : "#f3f4f6"; 
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");


  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/", icon: <FaHome className="mr-2 w-4 h-4" />, protected: false },

    { name: "Browse Cars", path: "/browse-cars", icon: <FaSearch className="mr-2 w-4 h-4" />, protected: false },

    { name: "Add Car", path: "/add-car", icon: <FaPlus className="mr-2 w-4 h-4" />, protected: true },

    { name: "My Listings", path: "/my-listings", icon: <FaKey className="mr-2 w-4 h-4" />, protected: true },

    { name: "My Bookings", path: "/my-bookings", icon: <FaClipboardList className="mr-2 w-4 h-4" />, protected: true },
  ];

  const isActive = (path) => location.pathname === path;

  const handleNavClick = (link) => {
    if (link.protected && !user) navigate("/login");
    else {
      navigate(link.path);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Log Out?",
  text: "Do you want to securely log out?",
  icon: "warning",
     showCancelButton: true,
   confirmButtonText: "Yes, Log Out",
      cancelButtonText: "Cancel",
     confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
   if (result.isConfirmed) {
    logout();
   Swal.fire({ title: "Logged Out!", icon: "success", timer: 1500, showConfirmButton: false });
      }
    });
  };

  // Dynamic colors based on theme

  const bgColor = theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-gray-100 text-gray-800";
  const menuBg = theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-white text-gray-900";
  const hoverColor = theme === "dark" ? "hover:bg-amber-500/20 hover:text-amber-400" : "hover:bg-amber-500/20 hover:text-amber-600";

  return (
    <nav className={`fixed w-full z-50 ${bgColor} backdrop-blur-md py-3 shadow-lg transition-colors`}>
     <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">

        {/* Logo */}

     <Link to="/" className="flex items-center text-2xl font-extrabold text-amber-500 font-playfair">
  <FaCarSide className="mr-2 w-8 h-8" /> RentWheels
     </Link>

        {/* Desktop Links */}

     <ul className="hidden lg:flex space-x-6">
     {navLinks.map((l) => (
     <li key={l.name}>
   <button
    onClick={() => handleNavClick(l)}
       className={`flex items-center px-4 py-2 rounded-xl transition-all ${
       isActive(l.path) ? "bg-amber-500/25 text-amber-400 shadow" : hoverColor
        }`}
              >
         {l.icon} {l.name}
        </button>
            </li>
          ))}
        </ul>


   <div className="flex items-center space-x-4">
           
          {/* Theme toggle */}

     <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700 hover:text-yellow-300 transition">
  {theme === "dark" ? <FaSun className="w-6 h-6 text-yellow-400"/> : <FaMoon className="w-6 h-6 text-gray-900"/>}
     </button>

    {!user ? (
     <Link to="/login" className="bg-amber-400 text-gray-900 px-6 py-2 rounded-full font-semibold shadow-lg hover:scale-105 transition">  Log In
     </Link>
    ) : (
  <div className="relative hidden lg:block">
    <button onClick={() => setDropdownOpen(!dropdownOpen)} className={`flex items-center space-x-2 p-1 rounded-full ${theme==="dark"?"bg-gray-800":"bg-gray-200"}`}>
        {user.photoURL ? <img src={user.photoURL} className="w-10 h-10 rounded-full" alt="User" /> : <FaUserCircle className="w-10 h-10 text-amber-500"/>}
  <FaAngleDown className={`${dropdownOpen ? "rotate-180" : "rotate-0"} w-4 h-4 transition-transform`}/>
     </button>
    {dropdownOpen && (
         <div className={`absolute right-0 mt-2 w-64 ${menuBg} border rounded-2xl shadow-xl py-2 z-50`}>
        <div className="px-5 py-3 border-b">
  <p className="text-amber-400 font-bold truncate">{user.displayName}</p>
      <p className="text-sm truncate mt-0.5">{user.email}</p>
       </div>
      <div className="py-1">
      {navLinks.filter(l=>l.protected).map(l=>(
        <button key={l.name} onClick={()=>handleNavClick(l)} className={`flex items-center px-5 py-2 rounded-xl hover:bg-amber-500/25 w-full`}>
        {l.icon} {l.name}
        </button>
          ))}
     </div>
      <hr className="my-1 border-gray-500"/>
      <button onClick={handleLogout} className="flex items-center w-full px-5 py-2 text-red-500 hover:bg-red-500/20 rounded-b-2xl">
   <FaSignOutAlt className="mr-3"/>  Log Out
         </button>
        </div>
        )}
        </div>
          )}

          {/* Mobile hamburger */}

   <button className="lg:hidden p-2" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}>
   {mobileMenuOpen ? <FaTimes className="w-7 h-7 text-amber-500"/> : <FaBars className="w-7 h-7"/>}
     </button>
        </div>
      </div>

      {/* Mobile Menu */}
      
      <div className={`${mobileMenuOpen?"max-h-[500px] opacity-100":"max-h-0 opacity-0"} overflow-hidden transition-all duration-500`}>
        <ul className={`${menuBg} flex flex-col space-y-1 py-4 px-4 border-t`}>
    {navLinks.map(link=>(
       <li key={link.name}>
       <button onClick={()=>handleNavClick(link)} className="flex items-center py-3 px-3 w-full">{link.icon} {link.name}</button>
      </li>
          ))}
          {!user ? (
            <li>
   <Link to="/login" className="block w-full text-center bg-amber-400 text-gray-900 px-5 py-3 rounded-full font-semibold mt-2">    Log In
              </Link>
            </li>
          ) : (
            <li>
     <button onClick={handleLogout} className="flex items-center w-full py-3 px-3 text-red-500 rounded-xl mt-2">
   <FaSignOutAlt className="mr-3"/>  Log Out
      </button>
      </li>
      )}
     </ul>
  </div>
    </nav>
  );
};

export default Navbar;
