
"use client";

import React, { useState } from "react";
// import RegisterModal from "./modal/registerModal";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-white text-2xl font-semibold">
          Logo
        </a>

        {/* Navbar items */}
        <div className="hidden md:flex space-x-6">
          <a href="#" className="text-white">Home</a>
          <a href="#" className="text-white">About</a>
          <a href="#" className="text-white">Services</a>
          <a href="#" className="text-white">Contact</a>
        </div>

        {/* <div className="w-1 h-full bg-black"></div> */}

        {/* log in and sign up */}
        <div className="hidden md:flex space-x-6">
          {/* <RegisterModal /> */}
          <a href="#" className="text-white">Sign up</a>
        </div>

        {/* Hamburger menu (visible on mobile) */}
        <button
          className="md:hidden text-white"
          onClick={toggleMobileMenu}
        >
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white"></span>
        </button>
      </div>

      {/* Collapsible menu (only visible on mobile) */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} bg-gray-800`}>
        <a href="#" className="block text-white p-4">Home</a>
        <a href="#" className="block text-white p-4">About</a>
        <a href="#" className="block text-white p-4">Services</a>
        <a href="#" className="block text-white p-4">Contact</a>
      </div>
    </div>
  );
};

export default Navbar;
