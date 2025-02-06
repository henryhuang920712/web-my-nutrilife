"use client";

import { useState } from "react";

export default function SearchInfo({ onSearch }) {
  const [foodName, setFoodName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  let debounceTimeout = null;

  // 當輸入改變時，觸發搜尋建議
  const handleInputChange = (e) => {
    const value = e.target.value;
    setFoodName(value);

    if (debounceTimeout) clearTimeout(debounceTimeout);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
    } else {
      debounceTimeout = setTimeout(() => fetchSuggestions(value), 300);
    }
  };

  // 從後端獲取匹配的食物名稱
  const fetchSuggestions = async (value) => {
    try {
      const response = await fetch("/api/foodSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: value }),
      });
      const data = await response.json();
      setSuggestions(data);
      setShowDropdown(data.length > 0);
    } catch (error) {
      console.error("Error fetching food suggestions:", error);
    }
  };

  // 選擇建議選項
  const handleSelect = (selectedFood) => {
    setFoodName(selectedFood.f_name);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter food name"
          value={foodName}
          onChange={handleInputChange}
          className="border-2 border-gray-300 p-2 rounded-md flex-grow focus:outline-none focus:border-2 focus:border-black" // Lighter gray border by default, thinner black on focus
        />
        <button
          onClick={() => onSearch(foodName)}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-200"
        >
          Search
        </button>
      </div>

      {showDropdown && (
        <ul className="absolute bg-white border rounded-md w-full max-h-80 overflow-auto shadow-md mt-1">
          {suggestions.map((food) => (
            <li
              key={food.f_id}
              onClick={() => handleSelect(food)}
              className="cursor-pointer p-2 hover:bg-gray-100 border-b"
            >
              {food.f_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
