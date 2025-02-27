"use client";

import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import DatePicker from "../calendar/datePicker";
import dayjs from "dayjs";
import { Trash2, Plus, Save, X, Utensils, Clock, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function MealTracker() {
  const currentDate = dayjs();
  const [nowDate, setNowDate] = useState(currentDate.format("YYYY-MM-DD"));
  const [meals, setMeals] = useState([]);
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
      const response = await fetch("/api/food/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    const dateStr = nowDate;
    try {
      const response = await fetch("/api/meal/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({dateStr}),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch meals");
      }

      const data = await response.json();

      const nowMeals = data.map((row, index) => {
        const [nowH, nowM, nowS] = row.time.split(":");
        const nowTime = new Date();
        nowTime.setHours(nowH, nowM, nowS);
        const timeStr = nowTime.toLocaleTimeString("en-US", {
          timeZone: "Asia/Taipei",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        });
        return {
          rowId: index,
          foodId: row.f_id,
          foodName: row.f_name,
          foodCategory: row.f_category,
          formattedTime: nowTime,
          dateStr: nowDate,
          timeStr,
          grams: row.eaten_grams,
        };
      });

      setMeals([...nowMeals].sort((a, b) => a.formattedTime - b.formattedTime));

    } catch (error) {
      console.error("Error fetching meals:", error);
      alert("Error fetching meals");
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setFoodName(value);

    if (value.trim() === "") {
      setSuggestions([]);
      setShowDropdown(false);
    } else {
      const filtered = foodData
        .filter((row) => row.f_name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 10);
      setSuggestions(filtered);
      setShowDropdown(filtered.length > 0);
    }
  };

  const handleSelect = ({ nowFoodName, nowFoodCategory }) => {
    setFoodName(nowFoodName);
    setFoodCategory(nowFoodCategory);
    setSuggestions([]);
    setShowDropdown(false);
  };

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
    preloadUserMeals();
  }, [nowDate]);

  useEffect(() => {
    fetchFoodData();
  }, []);

  const addMeal = async (e) => {
    e.preventDefault();

    if (!foodName || !foodCategory || !time || !grams) {
      alert("Please fill in all fields");
      return;
    }

    const rowId = meals.length;
    const foodId = foodData.find((row) => row.f_name === foodName)?.f_id;
    const formattedTime = new Date();
    const [hours, minutes] = time.split(":");
    formattedTime.setHours(hours, minutes);

    const dateStr = nowDate;

    const timeStr = formattedTime.toLocaleTimeString("en-US", {
      timeZone: "Asia/Taipei",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMeal = {
      rowId,
      foodId,
      foodName,
      foodCategory,
      formattedTime,
      dateStr,
      timeStr,
      grams,
    };

    try {
      const response = await fetch("/api/meal/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foodId, dateStr, timeStr, grams }),
      });

      if (!response.ok) {
        throw new Error("Failed to add meal");
      }

      const data = await response.json();

      if (data.message === "Updated existing meal") {
        const index = meals.findIndex(
          (row) =>
            row.foodId === foodId &&
            row.dateStr === dateStr &&
            row.timeStr === timeStr
        );
        setMeals((prev) => {
          const updatedMeals = [...prev];
          newMeal.rowId = index;
          updatedMeals[index] = newMeal;
          return updatedMeals.sort((a, b) => a.formattedTime - b.formattedTime);
        });
      } else {
        setMeals((prev) =>
          [...prev, newMeal].sort((a, b) => a.formattedTime - b.formattedTime)
        );
      }

      setFoodName("");
      setFoodCategory("");
      setTime("");
      setGrams("");
      setShowForm(false);
    } catch (error) {
      console.error("Error adding meal:", error);
      alert("Error adding meal");
    }
  };

  const handleCheckboxChange = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelected(
      selected.length === meals.length ? [] : meals.map((row) => row.rowId)
    );
  };

  const handleRemoveRows = () => {
    meals.forEach((row) => {
      if (selected.includes(row.rowId)) {
        fetch("/api/meal/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            foodId: row.foodId,
            dateStr: row.dateStr,
            timeStr: row.timeStr,
          }),
        })
          .then((response) => {
            if (!response.ok) throw new Error("Failed to delete meal");
          })
          .catch((error) => {
            console.error("Error deleting meal:", error);
            alert("Error deleting meal");
          });
      }
    });

    setMeals((prev) => prev.filter((row) => !selected.includes(row.rowId)));
    setSelected([]);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 md:p-8">
      <Card className="max-w-5xl mx-auto shadow-lg">
        <CardHeader className="space-y-4 pb-6">
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center">
              Daily Meal Tracker
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Track your daily food intake and maintain a healthy diet
            </CardDescription>
          </div>
          <div className="flex justify-center">
            <DatePicker
              fieldName="nowDate"
              value={nowDate}
              setFieldValue={(value) => {setNowDate(value);} }
              className="w-48"
              useFormik={false}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {selected.length > 0 && (
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={handleRemoveRows}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Selected ({selected.length})
              </Button>
            </div>
          )}

          <div className="rounded-xl border bg-card shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="w-12 p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onChange={handleSelectAll}
                      checked={
                        selected.length === meals.length && meals.length > 0
                      }
                    />
                  </th>
                  {/* 新增日期欄位 */}
                  {/* <th className="p-4 text-left font-medium">Date</th>{" "} */}
                  <th className="p-4 text-left font-medium">
                    <div className="flex items-center gap-2">
                      <Utensils className="w-4 h-4" />
                      Food Name
                    </div>
                  </th>
                  <th className="p-4 text-left font-medium">Category</th>
                  <th className="p-4 text-left font-medium">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time
                    </div>
                  </th>
                  <th className="p-4 text-left font-medium">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4" />
                      Amount
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {meals.length > 0 ? (
                  meals.map((meal, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={selected.includes(index)}
                          onChange={() => handleCheckboxChange(index)}
                        />
                      </td>
                      {/* 顯示日期 */}
                      {/* <td className="p-4 font-medium">{meal.dateStr}</td>{" "} */}
                      <td className="p-4 font-medium">{meal.foodName}</td>
                      <td className="p-4 text-muted-foreground">
                        {meal.foodCategory}
                      </td>
                      <td className="p-4">{meal.timeStr}</td>
                      <td className="p-4">{meal.grams}g</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Utensils className="w-8 h-8" />
                        <p>No meals recorded for today</p>
                      </div>
                    </td>
                  </tr>
                )}

                {showForm && (
                  <tr className="border-b bg-muted/30">
                    <td className="p-4"></td>
                    {/* 加上日期 */}
                    {/* <td className="p-4">
                      <div className="flex justify-center">
                        <DatePicker
                          fieldName="nowDate"
                          value={nowDate}
                          setFieldValue={setNowDate}
                          className="w-48"
                          useFormik={false}
                        />
                      </div>
                    </td> */}
                    <td className="p-4 dropdown-container relative">
                      <Input
                        type="text"
                        placeholder="Enter food name"
                        value={foodName}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                      {showDropdown && (
                        <ScrollArea className="absolute z-50 w-full max-h-72 mt-1 rounded-lg border bg-card shadow-xl">
                          <div className="p-1">
                            {suggestions.length > 0 ? (
                              suggestions.map(
                                (
                                  {
                                    f_name: nowFoodName,
                                    f_category: nowFoodCategory,
                                  },
                                  index
                                ) => (
                                  <button
                                    key={index}
                                    onClick={() =>
                                      handleSelect({
                                        nowFoodName,
                                        nowFoodCategory,
                                      })
                                    }
                                    className="w-full p-3 text-left hover:bg-accent rounded-md transition-colors flex items-center gap-2"
                                  >
                                    <Utensils className="w-4 h-4" />
                                    {nowFoodName}
                                  </button>
                                )
                              )
                            ) : (
                              <div className="p-3 text-muted-foreground text-center">
                                No results found
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      )}
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {foodCategory || "--"}
                    </td>
                    <td className="p-4">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        placeholder="Grams"
                        value={grams}
                        onChange={(e) => setGrams(e.target.value)}
                        className="w-full"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center gap-3">
            {showForm ? (
              <>
                <Button
                  onClick={addMeal}
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Meal
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowForm(false)}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add New Meal
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
