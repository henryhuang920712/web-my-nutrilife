"use client";
import DatePicker from "@/components/calendar/datePicker";
import dayjs from "dayjs";
import { useState } from "react";
// import { format } from "date-fns";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const chartConfig = {
  consumedAmount: {
    label: "Consumed Amount",
    color: "hsl(var(--chart-1))",
  },
  suggestedAmount: {
    label: "Suggested Amount",
    color: "hsl(var(--chart-2))",
  },
}

function getDateRange(startDate, endDate) {
  let dateArray = [];
  let currentDate = new Date(startDate);

  // Format the date to YYYY-MM-DD
  const formatDate = (date) => {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Loop through the range and push the formatted dates into the array
  while (currentDate <= endDate) {
    dateArray.push(formatDate(new Date(currentDate))); // Push formatted date
    currentDate.setDate(currentDate.getDate() + 1); // Increment the date by 1
  }

  return dateArray;
}


export default function NutrientAnalysis() {
  const currentDate = dayjs();
  const [startDate, setStartDate] = useState(currentDate.format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(currentDate.format("YYYY-MM-DD"));
  const [nutrient, setNutrient] = useState("熱量");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const nutrientOptions = ["熱量", "總碳水化合物", "膳食纖維"];

  // 查詢營養素資料
  const fetchNutrientData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/nutrientAnalysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startDate, endDate, nutrientName: nutrient }),
      });
      const result = await response.json();
      if (response.ok) {
        const dateRange = getDateRange(new Date(startDate), new Date(endDate));
        const nowChartData = dateRange.map((date) => {
          // if no data for the date, return 0
          const data = result.find((item) => {
            const formattedDate = dayjs(item.date).format("YYYY-MM-DD");
            return formattedDate === date;
          });
          return {
            date: date,
            consumedAmount: data ? data.n_consumed_amount : 0,
            suggestedAmount: data ? data.n_sugg_amount : 0,
          };
        });
        console.log(nowChartData);
        setData(nowChartData);

      } else {
        console.error("Error:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="p-4 col-span-2 bg-white rounded shadow-md">
      <div>
        <div>
          <h5 className="text-base font-semibold mb-2">Nutrient Analysis</h5>
        </div>
        <div className="flex md:flex-row gap-8 items-center justify-between w-full">
          <div className="flex gap-1 flex-col items-start">
            <h6 className="text-sm font-semibold">Start</h6>
            <DatePicker
              fieldName="startDate" // Optional, just for identification
              value={startDate} // Pass the current value (local state)
              setFieldValue={setStartDate} // Pass the setter function (to update the local state)
              useFormik={false} // Optional, default is true
              className=" rounded p-2 text-sm w-auto"
            />
          </div>
          <div className="flex gap-1 flex-col items-start">
            <h6 className="text-sm font-semibold">End</h6>
            <DatePicker
              fieldName="endDate" // Optional, just for identification
              value={endDate} // Pass the current value (local state)
              setFieldValue={setEndDate} // Pass the setter function (to update the local state)
              useFormik={false} // Optional, default is true
              className="rounded p-2 text-sm w-auto"
            />
          </div>
          <div className="flex flex-col items-start w-full">
            <h6 className="text-sm font-semibold pb-2">Nutrient</h6>
            <div className="flex justify-between w-full gap-2">
              <Select onValueChange={(value) => setNutrient(value)} className="w-full">
                <SelectTrigger className="w-1/2">
                  <SelectValue placeholder="Select a Nutrient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Nutrients</SelectLabel>
                    {nutrientOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <button
                onClick={fetchNutrientData}
                disabled={loading}
                className="px-8 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors"
              >
                {loading ? "載入中..." : "查詢"}
              </button>
            </div>
          </div>

        </div>

        <div className="mt-6 h-80">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="consumedAmount"
                type="natural"
                fill="var(--color-consumedAmount)"
                fillOpacity={0.4}
                stroke="var(--color-consumedAmount)"
                stackId="a"
              />
              <Area
                dataKey="suggestedAmount"
                type="natural"
                fill="var(--color-suggestedAmount)"
                fillOpacity={0.4}
                stroke="var(--color-suggestedAmount)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
