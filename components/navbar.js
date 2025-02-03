
"use client";

import React, { useState, useEffect } from "react";
import OptionMenu from "./dropdown/optionMenu";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";  

const Navbar = ({...props}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = props.isLoginModalOpen ? useState(props.isLoginModalOpen) : useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = props.isRegisterModalOpen ? useState(props.isRegisterModalOpen) : useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [status]);

  return (
    <div className="p-6 animate-fadeIn h-20 bg-gray-800">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-white text-2xl font-semibold">
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
        {/* <a  className="mx-0">{session.user?.email}</a> */}
        <div className="hidden md:flex space-x-6">
          {isLoggedIn ? <OptionMenu />
							:
              <div>
              <button
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  onClick={() => setIsLoginModalOpen(true)}
              >
                  Login
              </button>
              </div>
						} 

          <div className="">
            <button
                className="px-4 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                onClick={() => setIsRegisterModalOpen(true)}
            >
                Register
            </button>     
              
        </div>
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

const GetStartedButton = ({setIsLoginModalOpen, setNavigatePath }) => {
  const { data: session, status } = useSession();
  
  const router = useRouter();
  const handleStart = () => {
    // if session then redirect to dashboard
    // else open login modal
    if (status === "authenticated") {
      // redirect to dashboard
      router.push("/dashboard");
    } else {
      // open login modal
      setIsLoginModalOpen(true);
      setNavigatePath("/dashboard");
    }
  }


  return (
    <>
    <button onClick={handleStart} className="bg-white text-black px-6 py-2 rounded-full hover:bg-black hover:text-white cursor-pointer transition-all">
    Get started
  </button>
  </>
  )
}
export { Navbar, GetStartedButton };
export default Navbar;
