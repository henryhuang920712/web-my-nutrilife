import Image from "next/image";
// import ImageSlider from "../components/imageSlider";
import { GetStartedButton } from "../components/navbar";
import AuthProvider from "@/components/authProvider";
import { Info } from "lucide-react";
export default function Home({ setIsLoginModalOpen, setNavigatePath }) {
  return (
    <div>
      <section className=" w-full h-[calc(100vh-4.5rem)] relative overflow-hidden flex bg-gradient-to-r from-blue-400 to-slate-100 ">

        {/* background color */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'ellipse(70% 10% at 50% 100%)',
            background: 'white', // Customize gradient
          }}
        ></div>

        <div className="w-1/3 h-full flex flex-col justify-center items-start relative ps-20">
          <h1 className="text-white text-4xl font-semibold text-left py-2">
            Empowering Your Health Journey with Every Bite
          </h1>
          <h3 className="text-white text-lg text-left py-2">
            Track, Analyze, and Thrive with MyNutriLife
          </h3>
          <div className="mt-4 flex">
            <AuthProvider>
              <GetStartedButton setIsLoginModalOpen={setIsLoginModalOpen} setNavigatePath={setNavigatePath} />
            </AuthProvider>
            <a href="#about" className="border-white border-2 font-semibold flex space-x-2 ml-4 text-white px-6 py-2 rounded-full hover:bg-white hover:text-black cursor-pointer transition-all">
              <Info />
              <p>
                Learn more
              </p>

            </a>
          </div>
        </div>
        <div className="w-2/3 h-full relative">
          <Image
            src="/homepage/1.png"
            alt="Description"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </section >
      <section id="about" className="w-full bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            About Us
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Mission
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                At MyNutriLife, our mission is to empower individuals to take control of their health and well-being through personalized nutrition guidance. We believe that the foundation of a healthy lifestyle starts with understanding what you eat, how it affects your body, and how to make informed choices.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mt-4">
                Using cutting-edge technology and the latest dietary science, our platform allows users to track their food intake, analyze nutrient consumption, and gain insights into how to improve their diet. With the support of professional nutritionists and health experts, MyNutriLife offers a comprehensive and data-driven approach to wellness.
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Our Values
              </h3>
              <ul className="list-disc pl-6 space-y-2 text-lg text-gray-600">
                <li>Empathy: We understand the challenges of maintaining a healthy lifestyle and strive to provide support every step of the way.</li>
                <li>Innovation: We constantly look for ways to improve the user experience by incorporating the latest research and technologies.</li>
                <li>Personalization: We believe that every individual’s dietary needs are unique, and we tailor our recommendations accordingly.</li>
                <li>Trust: Our platform is built on trust and accuracy, providing users with reliable and evidence-based nutritional advice.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>



      <section className="w-full bg-gray-100 py-16 px-8" id="contact">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-black mb-6">Contact Us</h2>
          <p className="text-lg text-gray-700 mb-8">We'd love to hear from you! Please fill out the form below to get in touch.</p>

          {/* Contact Form */}
          <form className="space-y-6">
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <textarea
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-all"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
