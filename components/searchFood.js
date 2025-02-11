"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchInfo from "./searchInfo";

export default function SearchFoodPage() {
  const [selectedFood, setSelectedFood] = useState(null);
  const [nutrients, setNutrients] = useState([]);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const queryParam = router.query.query;
      setQuery(queryParam || "");
      handleSearch(queryParam || "");
    }
  }, [router.isReady, router.query]);

  const handleSearch = async (foodName) => {
    if (!foodName) return;
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

  const categorizeNutrients = (nutrients) => {
    const categories = {
      基本營養素: ["熱量", "總碳水化合物", "粗蛋白", "粗脂肪"],
      維生素: [
        "維生素A總量(IU)",
        "維生素B1",
        "維生素B2",
        "維生素B6",
        "維生素B12",
        "葉酸",
        "菸鹼素",
        "維生素E總量",
      ],
      礦物質: ["鈣", "鐵", "鈉", "鉀", "鋅", "磷", "鎂"],
      脂肪與膽固醇: ["飽和脂肪", "膽固醇"],
      其他營養素: ["胺基酸總量", "脂肪酸組成"],
    };

    const categorized = {
      基本營養素: [],
      維生素: [],
      礦物質: [],
      脂肪與膽固醇: [],
      其他營養素: [],
    };

    nutrients.forEach((nutrient) => {
      for (const category in categories) {
        if (categories[category].includes(nutrient.n_name)) {
          categorized[category].push(nutrient);
          break;
        }
      }
    });

    return categorized;
  };

  const categorizedNutrients = categorizeNutrients(nutrients);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-4xl font-bold text-center mb-6">營養成分查詢</h2>
      <p className="text-center text-gray-600 mb-4 text-lg">
        輸入食物名稱，獲取詳細的營養資訊
      </p>

      {/* 搜尋框 */}
      <div className="flex justify-center items-center space-x-3 mb-6">
        <SearchInfo
          onSearch={handleSearch}
          buttonClass="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        />
      </div>

      {/* 營養資訊區塊 */}
      {selectedFood && (
        <div>
          <h3 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            {selectedFood} 的營養成分 (每 100g)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 基本營養素 + 脂肪與膽固醇 + 其他營養素 */}
            <div className="bg-white shadow-lg rounded-xl p-8">
              <h4 className="text-2xl font-semibold mb-4">基本營養素</h4>
              <ul className="space-y-3">
                {categorizedNutrients["基本營養素"].map((nutrient, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b pb-2 hover:bg-gray-100 text-lg"
                  >
                    <span>{nutrient.n_name}</span>
                    <span className="font-medium">
                      {nutrient.n_amount_in_100g_f} {nutrient.n_unit}
                    </span>
                  </li>
                ))}
              </ul>

              <h4 className="text-2xl font-semibold mt-6 mb-4">脂肪與膽固醇</h4>
              <ul className="space-y-3">
                {categorizedNutrients["脂肪與膽固醇"].map((nutrient, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b pb-2 hover:bg-gray-100 text-lg"
                  >
                    <span>{nutrient.n_name}</span>
                    <span className="font-medium">
                      {nutrient.n_amount_in_100g_f} {nutrient.n_unit}
                    </span>
                  </li>
                ))}
              </ul>

              <h4 className="text-2xl font-semibold mt-6 mb-4">其他營養素</h4>
              <ul className="space-y-3">
                {categorizedNutrients["其他營養素"].map((nutrient, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b pb-2 hover:bg-gray-100 text-lg"
                  >
                    <span>{nutrient.n_name}</span>
                    <span className="font-medium">
                      {nutrient.n_amount_in_100g_f} {nutrient.n_unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 維生素 */}
            <div className="bg-white shadow-lg rounded-xl p-8">
              <h4 className="text-2xl font-semibold mb-4">維生素</h4>
              <ul className="space-y-3">
                {categorizedNutrients["維生素"].map((nutrient, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b pb-2 hover:bg-gray-100 text-lg"
                  >
                    <span>{nutrient.n_name}</span>
                    <span className="font-medium">
                      {nutrient.n_amount_in_100g_f} {nutrient.n_unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 礦物質 */}
            <div className="bg-white shadow-lg rounded-xl p-8">
              <h4 className="text-2xl font-semibold mb-4">礦物質</h4>
              <ul className="space-y-3">
                {categorizedNutrients["礦物質"].map((nutrient, index) => (
                  <li
                    key={index}
                    className="flex justify-between border-b pb-2 hover:bg-gray-100 text-lg"
                  >
                    <span>{nutrient.n_name}</span>
                    <span className="font-medium">
                      {nutrient.n_amount_in_100g_f} {nutrient.n_unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
