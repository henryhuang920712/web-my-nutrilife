"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Analytics",
    items: ["Overview", "Reports", "Trends"],
  },
  {
    name: "Management",
    items: ["Users", "Projects", "Tasks"],
  },
  {
    name: "Settings",
    items: ["Profile", "Preferences", "Billing"],
  },
  {
    name: "Support",
    items: ["FAQ", "Contact Us"],
  }
];

export default function Sidebar() {
  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (index) => {
    setOpenCategory(openCategory === index ? null : index); // Toggle the selected category
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-[calc(100vh-5rem)]">
      {/* Sidebar Header */}
      <div className="p-4 text-xl font-bold border-b border-gray-700">
        Dashboard
      </div>

      {/* Scrollable Menu (Custom Scrollable Div) */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav>
          {categories.map((category, index) => (
            <div key={index} className="mb-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(index)}
                className="flex justify-between items-center w-full p-2 rounded-lg hover:bg-gray-800"
              >
                {category.name}
                {openCategory === index ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>

              {/* Category Items with Animation */}
              <ul
                className={`ml-4 mt-1 space-y-1 transition-all duration-300 ease-in-out ${
                  openCategory === index
                    ? "opacity-100 scale-y-100 max-h-screen"
                    : "opacity-0 scale-y-0 max-h-0 overflow-hidden"
                }`}
                style={{
                  transformOrigin: "top",
                  transition: "transform 0.3s ease-out, opacity 0.3s ease-out, max-height 0.3s ease-out",
                }}
              >
                {category.items.map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="block p-2 rounded-lg hover:bg-gray-700"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg">
          Logout
        </button>
      </div>
    </aside>
  );
}
