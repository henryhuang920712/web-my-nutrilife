"use client";

import { useState } from "react";

export default function FoodSearchPage() {
  const [foodName, setFoodName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [nutrients, setNutrients] = useState([]);

  const handleSearch = async () => {
    if (!foodName) return;
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName }),
      });
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const fetchNutrients = async (foodId, foodName) => {
    try {
      const response = await fetch("/api/search/nutrients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodId }),
      });
      const data = await response.json();
      setSelectedFood(foodName);
      setNutrients(data);
    } catch (error) {
      console.error("Fetch nutrients error:", error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Search Food and View Nutrients</h2>

      {/* 搜尋框 */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter food name"
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="border p-2 rounded-md w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* 食物搜尋結果 */}
      {searchResults.length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
          <ul className="border rounded-md">
            {searchResults.map((food) => (
              <li
                key={food.f_id}
                onClick={() => fetchNutrients(food.f_id, food.f_name)}
                className="cursor-pointer p-2 hover:bg-gray-100 border-b"
              >
                {food.f_name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 營養素資訊表格 */}
      {selectedFood && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">
            Nutrients in {selectedFood} (per 100g)
          </h3>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Nutrient</th>
                <th className="border p-2">Amount</th>
                <th className="border p-2">Unit</th>
              </tr>
            </thead>
            <tbody>
              {nutrients.length > 0 ? (
                nutrients.map((nutrient, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">{nutrient.n_name}</td>
                    <td className="border p-2">
                      {nutrient.n_amount_in_100g_f}
                    </td>
                    <td className="border p-2">{nutrient.n_unit}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center p-2 text-gray-500">
                    No nutrients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
