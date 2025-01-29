import Image from "next/image";
import Navbar from "../components/navbar";
// import ImageSlider from "../components/imageSlider";
import AuthProvider from "@/components/authProvider";
export default function Home() {
  return (
    <div className="container w-full h-screen relative overflow-hidden">
      <div className="absolute w-full h-full">
        <Image
          src="/homepage/1.jpg"  // Note: starts with '/'
          alt="Hero"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50 animate-fullMask">
      <AuthProvider>
        <Navbar />
        </AuthProvider>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col">
          <h1 className="text-white text-4xl font-semibold text-center">
            Welcome to our website
          </h1>
          <h3 className="text-white text-lg text-center">
            We provide the best services
          </h3>
          <div className="mt-6">
            <button className="bg-white text-black px-6 py-2 rounded-full hover:bg-black hover:text-white cursor-pointer transition-all">
              Get started
            </button>
            <button className="ml-4 bg-white text-black px-6 py-2 rounded-full hover:bg-black hover:text-white cursor-pointer transition-all">
              Learn more
            </button>
          </div>
        </div>
      </div>

    </div >
  );
}
