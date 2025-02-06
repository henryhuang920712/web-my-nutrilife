"use client";

import { useState } from "react";
import SearchInfo from "./searchInfo";

export default function SearchFoodPage() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [nutrients, setNutrients] = useState([]);

  // 當使用者按下 Search 按鈕時觸發查詢
  const handleSearch = async (foodName) => {
    try {
      const response = await fetch("/api/foodSearch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName }),
      });
      const data = await response.json();

      if (data.length > 0) {
        fetchNutrients(data[0].f_id, data[0].f_name);
      } else {
        setSelectedFood(null);
        setNutrients([]);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // 查詢營養成分
  const fetchNutrients = async (foodId, foodName) => {
    try {
      const response = await fetch("/api/nutrient", {
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

      {/* 搜尋框與按鈕 */}
      <SearchInfo onSearch={handleSearch} />

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
