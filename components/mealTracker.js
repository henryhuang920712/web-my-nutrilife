"use client";


import { useState } from "react";

export default function MealTracker() {
  const [meals, setMeals] = useState([]); // Store meal records
  const [showForm, setShowForm] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [time, setTime] = useState("");
  const [grams, setGrams] = useState("");

  const addMeal = (e) => {
    e.preventDefault();
    if (!foodName || !time || !grams) return alert("Please fill in all fields");

    const newMeal = { foodName, time, grams };
    setMeals([...meals, newMeal]); // Add new meal to list
    setFoodName("");
    setTime("");
    setGrams("");
    setShowForm(false); // Close form after adding
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Daily Meal Tracker</h2>
      
      {/* Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Food Name</th>
            <th className="border p-2">Time</th>
            <th className="border p-2">Grams Eaten</th>
          </tr>
        </thead>
        <tbody>
          {meals.length > 0 ? (
            meals.map((meal, index) => (
              <tr key={index} className="text-center">
                <td className="border p-2">{meal.foodName}</td>
                <td className="border p-2">{meal.time}</td>
                <td className="border p-2">{meal.grams}g</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center p-2 text-gray-500">
                No meals recorded yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Meal Button */}
      <button
        onClick={() => setShowForm(true)}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        Add Meal
      </button>

      {/* Meal Input Form */}
      {showForm && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Add a Meal</h3>
          <form onSubmit={addMeal} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Food Name"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="p-2 border rounded-md"
            />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="p-2 border rounded-md"
            />
            <input
              type="number"
              placeholder="Grams Eaten"
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              className="p-2 border rounded-md"
            />
            <div className="flex justify-between">
              <button
                type="submit"
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
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
