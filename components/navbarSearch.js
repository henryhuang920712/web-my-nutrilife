// This file designed the search function in navbar

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function NavbarSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  let debounceTimeout = null;

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
    } else {
      debounceTimeout = setTimeout(() => fetchSuggestions(value), 300);
    }
  };

  const fetchSuggestions = async (value) => {
    try {
      const response = await fetch("/api/foodSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: value }),
      });
      const data = await response.json();
      // Limit to 8 suggestions
      setSuggestions(data.slice(0, 8));
      setShowDropdown(data.length > 0);
    } catch (error) {
      console.error("Error fetching food suggestions:", error);
    }
  };

  const handleSelect = (selectedFood) => {
    setSearchQuery(selectedFood.f_name);
    setShowDropdown(false);
    router.push(`/search?foodName=${encodeURIComponent(selectedFood.f_name)}`);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      setShowDropdown(false);
      router.push(`/search?foodName=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          autoComplete="off"
          className="w-full py-2.5 pl-10 pr-4 bg-background border rounded-xl 
                   border-input shadow-sm transition-colors text-base
                   placeholder:text-muted-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Search for food"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleSearchKeyPress}
        />
      </div>

      {showDropdown && suggestions.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-2 overflow-hidden bg-card rounded-lg border shadow-lg 
                       border-border animate-in fade-in-0 zoom-in-95"
        >
          {suggestions.map((food) => (
            <li
              key={food.f_id}
              onClick={() => handleSelect(food)}
              className="px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors
                         border-b border-border last:border-0"
            >
              <span className="text-base font-medium">{food.f_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
