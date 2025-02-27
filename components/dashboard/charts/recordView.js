'use client';

import { useState, useEffect } from "react";
import { Clock, Link, Scale, Utensils, Plus } from "lucide-react";
import DatePicker from "@/components/calendar/datePicker";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function RecordView() {
  const currentDate = dayjs();
  const [meals, setMeals] = useState([]);
  const [nowDate, setNowDate] = useState(currentDate.format("YYYY-MM-DD"));
  const router = useRouter();

  const preloadUserMeals = async () => {
    const dateStr = nowDate;
    try {
      const response = await fetch("/api/meal/list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateStr }),
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

  useEffect(() => {
    preloadUserMeals();
  }, [nowDate]);

  return (
    <div className="p-4 col-span-2 bg-white rounded shadow-md">
      <div>
        <div>
          <h5 className="text-base font-semibold mb-2">Meal Record</h5>
        </div>
        <div className="flex md:flex-row gap-8 items-center justify-around w-full pb-2">
        
          <div className="flex gap-1 items-center">
          <h6 className="text-sm font-semibold">Select Date</h6>
            <DatePicker
              fieldName="startDate" // Optional, just for identification
              value={nowDate} // Pass the current value (local state)
              setFieldValue={setNowDate} // Pass the setter function (to update the local state)
              useFormik={false} // Optional, default is true
              className=" rounded p-2 text-sm w-auto"
            />
          </div>
          <Button
            onClick={() => router.push("/record")}
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Meal
          </Button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
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
          </tbody>
        </table>
      </div>
    </div>
  )
}