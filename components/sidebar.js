"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Dashboard",
    items: [],
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
    <aside className="w-48 text-gray-800 flex flex-col h-[calc(100vh-5rem)] p-2">
      {/* Sidebar Header */}
      <div className="p-4 text-lg font-semibold">
        Dashboard
      </div>

      {/* Scrollable Menu (Custom Scrollable Div) */}
      <div className="flex-1 overflow-y-auto p-2 text-sm">
        <nav>
          {categories.map((category, index) => (
            <div key={index} className="mb-2">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(index)}
                className="flex justify-between items-center w-full p-2 rounded-lg hover:bg-white hover:shadow-md"
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
                      className="block p-2 rounded-lg hover:bg-white hover:shadow-md"
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
    </aside>
  );
}
