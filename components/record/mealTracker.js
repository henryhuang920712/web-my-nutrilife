"use client";


import { useState, useEffect } from "react";

export default function MealTracker() {
  const [meals, setMeals] = useState([]); // Store meal records
  const [showForm, setShowForm] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [foodCategory, setFoodCategory] = useState("");
  const [time, setTime] = useState("");
  const [grams, setGrams] = useState("");
  const [selected, setSelected] = useState([]);

  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [foodData, setFoodData] = useState([]);


  const fetchFoodData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/food/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodName: "" }),
      });
      const status = response.status;
      if (status === 200) {
        const data = await response.json();
        setFoodData(data);
      } else {
        alert("An error occurred while fetching food suggestions");
      }
    } catch (error) {
      console.error("An error occurred while fetching food suggestions", error);
    }
    setLoading(false);
  };

  const preloadUserMeals = async () => {
    try {
      // Send POST request to the API
      const response = await fetch('/api/meal/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meals');
      }

      // Parse the response if successful
      const data = await response.json();

      const nowMeals = data.map((row, index) => {
        const [nowH, nowM, nowS] = row.time.split(":");
        const nowTime = new Date();
        nowTime.setHours(nowH, nowM, nowS);
        const timeStr = nowTime.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Taipei', // Set the time zone to Taipei
          hour12: false,
          hour: '2-digit',
          minute: '2-digit'
        });
        const dateStr = new Intl.DateTimeFormat('zh-TW', {
          timeZone: 'Asia/Taipei',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(nowTime).replace(/\//g, '-');

        return {
          rowId: index,
          foodId: row.f_id,
          foodName: row.f_name,
          foodCategory: row.f_category,
          formattedTime: nowTime,
          dateStr,
          timeStr,
          grams: row.eaten_grams,
        };
      })

      setMeals(nowMeals);

      // sort meals by time
      setMeals((prev) => prev.sort((a, b) => a.time - b.time));
    } catch (error) {
      console.error('Error fetching meals:', error);
      alert('Error fetching meals');
    }
  };


  const handleInputChange = (e) => {
    const value = e.target.value;
    setFoodName(value);

    // Filter suggestions
    if (value.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
    } else {
      const filtered = foodData.filter((row) => {
        return row.f_name.includes(value);
      });

      // limit the number of suggestions to 5
      setSuggestions(filtered.slice(0, 5));
      setShowDropdown(filtered.length > 0); // Show dropdown only if there are suggestions
    }
  };

  // selection of food item from dropdown
  const handleSelect = ({ nowFoodName, nowFoodCategory }) => {
    setFoodName(nowFoodName);
    setFoodCategory(nowFoodCategory);
    setSuggestions([]);
    setShowDropdown(false);
  };
  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchFoodData();
    preloadUserMeals();
  }, []);


  const addMeal = async (e) => {
    e.preventDefault();
    // find f_id from foodData

    if (!foodName || !foodCategory || !time || !grams) return alert("Please fill in all fields");
    // record index
    const rowId = meals.length;
    const foodId = foodData.find((row) => row.f_name === foodName)?.f_id;
    // Get the current date (or you can set a specific date)
    const formattedTime = new Date();
    const [hours, minutes] = time.split(":");

    // Set the time portion to the current date
    formattedTime.setHours(hours, minutes);
    const dateStr = new Intl.DateTimeFormat('zh-TW', {
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(formattedTime).replace(/\//g, '-');

    const timeStr = formattedTime.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Taipei', // Set the time zone to Taipei
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
    const newMeal = { rowId, foodId, foodName, foodCategory, formattedTime, dateStr, timeStr, grams };

    try {
      // Send POST request to the API
      const response = await fetch('/api/meal/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ foodId, dateStr, timeStr, grams }),
      });

      if (!response.ok) {
        throw new Error('Failed to add meal');
      }

      // Parse the response if successful
      const data = await response.json();

      // if message is "Updated existing meal"
      if (data.message === "Updated existing meal") {
        // find the index of the updated meal
        const index = meals.findIndex((row) => row.foodId === foodId && row.dateStr === dateStr && row.timeStr === timeStr);
        // update the meal record
        setMeals((prev) => {
          const updatedMeals = [...prev];
          newMeal.rowId = index;
          updatedMeals[index] = newMeal;
          return updatedMeals;
        });

      } else {
        setMeals([...meals, newMeal]); // Add new meal to list
      }
      // sort meals by time
      setMeals((prev) => prev.sort((a, b) => a.formattedTime - b.formattedTime));
      setFoodName("");
      setFoodCategory("");
      setTime("");
      setGrams("");
      setShowForm(false); // Close form after adding
    } catch (error) {
      console.error('Error adding meal:', error);
      alert('Error adding meal');
    }
  };
  // Toggle individual row selection
  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle "Select All" checkbox
  const handleSelectAll = () => {
    setSelected(selected.length === meals.length ? [] : meals.map((row) => row.rowId));
  };

  // Remove selected rows
  const handleRemoveRows = () => {
    console.log(meals);
    meals.forEach((row, index) => {
      if (selected.includes(row.rowId)) {
        console.log('Deleting meal:', row);
        // Send DELETE request to the API
        fetch('/api/meal/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ foodId: row.foodId, dateStr: row.dateStr, timeStr: row.timeStr }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to delete meal');
            }
            console.log('Meal deleted successfully:', row);
          })
          .catch((error) => {
            console.error('Error deleting meal:', error);
            alert('Error deleting meal');
          });
      }
    });
    setMeals((prev) => prev.filter((row) => !selected.includes(row.rowId)));
    setSelected([]); // Clear selection
  };


  // Fetch food items from the database



  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-xl font-bold mb-4">Daily Meal Tracker</h2>
      {selected.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={handleRemoveRows}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Remove Selected ({selected.length})
          </button>
        </div>
      )}
      {/* Table */}
      <table className="w-full border-collapse border-none border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-none p-2 w-12 text-center">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selected.length === meals.length && meals.length > 0}
              />
            </th>
            <th className="p-2">Food Name</th>
            <th className="p-2">Food Category</th>
            <th className="p-2">Time</th>
            <th className="p-2">Grams Eaten</th>
          </tr>
        </thead>
        <tbody>
          {meals.length > 0 ? (
            meals.map((meal, index) => (
              <tr key={index} className="text-center">
                <td className="p-2 text-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                <td className="p-2">{meal.foodName}</td>
                <td className="p-2">{meal.foodCategory}</td>
                <td className="p-2">{meal.timeStr}</td>
                <td className="p-2">{meal.grams}g</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-2 text-gray-500">
                {meals?.length === 0 && "No meals added yet"}
              </td>
            </tr>
          )}
          {showForm &&
            <tr>
              <td className="p-2 text-center">

              </td>
              <td className="p-2 dropdown-container">
                <input
                  type="text"
                  placeholder="Food Name"
                  value={foodName}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md w-full"
                />
                {/* Dropdown */}
                {showDropdown && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10">
                    {suggestions.length > 0 ? (
                      // suggestions: f_id, f_name, f_category
                      suggestions.map(({ f_name: nowFoodName, f_category: nowFoodCategory }, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelect({ nowFoodName, nowFoodCategory })} // Set the selected food name
                          className="p-2 cursor-pointer hover:bg-gray-100"
                        >
                          {nowFoodName}
                        </li>
                      ))
                    ) : (
                      <li className="p-2 text-gray-500">No results found</li>
                    )}
                  </ul>
                )}

              </td>
              <td className="p-2">

                {foodCategory.length === 0 ? "--" : foodCategory}
              </td>
              <td className="p-2">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="p-2 rounded-md w-full"
                />
              </td>
              <td className="p-2">
                <input
                  type="number"
                  placeholder="Grams Eaten"
                  value={grams}
                  onChange={(e) => setGrams(e.target.value)}
                  className="p-2 rounded-md w-full"
                />
              </td>

            </tr>
          }

          <tr>
            {showForm ? <td colSpan="3" className="text-center p-2">
              <button
                onClick={addMeal}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Save Meal
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
            </td> :
              <td colSpan="3" className="text-center p-2 text-gray-500">
                <button
                  onClick={() => { setShowForm(true); }}
                  className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Add Meal
                </button>
              </td>


            }
          </tr>

        </tbody>
      </table>
    </div>
  );
}
