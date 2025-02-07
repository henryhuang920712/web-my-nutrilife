
"use client";

import React, { useState, useEffect } from "react";
import OptionMenu from "./dropdown/optionMenu";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Settings, Search } from "lucide-react";
import Image from "next/image";

const Navbar = ({ isLoginModalOpen, setIsLoginModalOpen, isRegisterModalOpen, setIsRegisterModalOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  useEffect(() => {
    console.log(session);
    if (session) {
      setIsLoggedIn(true);
    }
  }
    , [session]);
  return (
    <div className="animate-fadeIn h-[4.5rem] bg-white py-3 z-20">
      <div className="px-6 mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="text-black text-2xl font-semibold flex items-center">
          <Image
            src="/homepage/logo-1.svg"
            alt="Logo"
            width={50}
            height={50}
          />
          <p className="text-gray-800">My</p>
          <p className="text-green-700">Nutri</p>
          <p className="text-sky-800">Life</p>
        </a>

        {/* <div className="w-1 h-full bg-black"></div> */}

        {/* log in and sign up */}
        {/* <a  className="mx-0">{session.user?.email}</a> */}
        <div className="md:flex space-x-4">
          <div className="relative me-4">
            {/* Left-side icon */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <Search />
            </div>
            <input
              type="search"
              name="search"
              id="search"
              className="w-full px-10 py-2 border"
              placeholder="Search Food"
              onChange={e => setSearchQuery(e.target.value)}
              value={searchQuery}
              onBlur={e => setSearchQuery(e.target.value)}
            />
          </div>
          {isLoggedIn ? <OptionMenu />
            :
            <div className="flex justify-center items-center px-4 py-1 text-black rounded-full hover:bg-gray-800 hover:text-white cursor-pointer transition-all">
              <button
                className=""
                onClick={() => setIsLoginModalOpen(true)}
              >
                Login
              </button>
            </div>
          }
          {isLoggedIn ?
            <div className="flex justify-center items-center border-none px-4 py-1 text-black rounded-full hover:bg-gray-800 hover:text-white cursor-pointer transition-all">
              <Settings />
            </div>
            :
            <div className="flex justify-center items-center border-2 px-4 py-1 text-black rounded-full hover:bg-gray-800 hover:text-white cursor-pointer transition-all">

              <button
                className=""
                onClick={() => setIsRegisterModalOpen(true)}
              >
                Register
              </button>
            </div>
          }



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

const GetStartedButton = ({ setIsLoginModalOpen, setNavigatePath }) => {
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
      <button onClick={handleStart} className="bg-white text-black px-6 py-2 rounded-full hover:bg-black hover:text-white cursor-pointer transition-all border-black">
        Get started
      </button>
    </>
  )
}
export { Navbar, GetStartedButton };
export default Navbar;
