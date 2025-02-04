
"use client";

import React, { useState, useEffect } from "react";
import OptionMenu from "./dropdown/optionMenu";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";  
import {Settings} from "lucide-react";

const Navbar = ({isLoginModalOpen, setIsLoginModalOpen, isRegisterModalOpen, setIsRegisterModalOpen}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    // Only proceed once session is no longer loading
    if (status === "loading") return;

    if (status === "authenticated") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [status]); // Depend on `status
  return (
    <div className="p-6 animate-fadeIn h-[4.5rem] bg-white">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-black text-2xl font-semibold">
          Logo
        </a>

        {/* <div className="w-1 h-full bg-black"></div> */}

        {/* log in and sign up */}
        {/* <a  className="mx-0">{session.user?.email}</a> */}
        <div className="hidden md:flex space-x-2">
          <div className="text-black px-4 py-1 flex justify-center items-center">
          <a href="#">Home</a>
          </div>
          <div className="text-black px-4 py-1 flex justify-center items-center">
          <a href="#">About</a>
          </div>
          <div className="text-black px-4 py-1 flex justify-center items-center">
          <a href="#">Services</a>
          </div>
          <div className="text-black px-4 py-1 flex justify-center items-center">
          <a href="#">Contact</a>
          </div>        
          {isLoggedIn ? <OptionMenu />
							:
              <div>
              <button
                  className="flex justify-center items-center px-4 py-1 text-black rounded-full hover:bg-gray-800 hover:text-white cursor-pointer transition-all"
                  onClick={() => setIsLoginModalOpen(true)}
              >
                  Login
              </button>
              </div>
						} 
          <div className="flex justify-center items-center border-2 px-4 py-1 text-black rounded-full hover:bg-gray-800 hover:text-white cursor-pointer transition-all">
            {isLoggedIn ?  <Settings /> : 
            <button
                className=""
                onClick={() => setIsRegisterModalOpen(true)}
            >
                Register
            </button>
          }

              
        </div>
        </div>

        {/* Hamburger menu (visible on mobile) */}
        <button
          className="md:hidden text-black"
          onClick={toggleMobileMenu}
        >
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white mb-1"></span>
          <span className="block w-6 h-1 bg-white"></span>
        </button>
      </div>

      {/* Collapsible menu (only visible on mobile) */}
      <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} bg-gray-800`}>
        <a href="#" className="block text-black p-4">Home</a>
        <a href="#" className="block text-black p-4">About</a>
        <a href="#" className="block text-black p-4">Services</a>
        <a href="#" className="block text-black p-4">Contact</a>
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
