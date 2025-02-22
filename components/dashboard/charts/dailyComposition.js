"use client"

import { TrendingUp } from "lucide-react"

import { Bar, BarChart, CartesianGrid, YAxis, XAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,

} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useDailyIntake } from '../dailyIntakeProvider';
import { useState, useEffect } from "react";


const nutrients = {
  "minerals": [12, 13, 14, 15, 16, 17, 18, 19, 20],
  "fat-soluble\nvitamins": [22, 30, 31, 32],
  "water-soluble\nvitamins": [23, 24, 25, 26, 27, 28, 29],
  "others": [9, 11]
}

const CustomBackground = (props) => {
  const { x, y, width, height, radius } = props;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={radius} // Rounded corners
      ry={radius}
      fill="#eee" // Background color
    />
  );
};


export default function DailyComposition({ }) {
  const [chartData, setChartData] = useState(null);
  const dailyIntake = useDailyIntake();

  const chartConfig = {
    nutrients: {
      label: "Nutrients"
    },
    value: {
      label: "Value"
    },
  }

  useEffect(() => {
    const nowChartData = Object.keys(nutrients).reduce((acc, key) => {
      acc[key] = dailyIntake
        ?.filter((item) => nutrients[key].includes(item.n_id))
        .map((item) => ({
          nutrients: item.n_name.replace(/總量.*/, ""),
          value: parseFloat(item.n_consumed_amount),
          fill: "var(--color-chrome)",
        }));
      return acc;
    }, {});

    setChartData(nowChartData);

    console.log(dailyIntake);
    
  }, [dailyIntake]);



  return (
    <div className="col-span-1" >
      <div className="rounded-lg bg-white" >
      <Tabs defaultValue="minerals" className="" >
        <TabsList className={`grid w-full grid-cols-4 items-stretch pb-20`}>
          {Object.keys(nutrients).map((key) => (
            chartData ? (  // Ensure it's not just an empty object/array
              <TabsTrigger value={key} key={key} className="text-center whitespace-pre-line py-2">
                <TrendingUp size={24} />
                {key}
              </TabsTrigger>
            ) : (
              <Skeleton key={key} className="h-4 w-[250px]" />
            )
          ))}


        </TabsList>
        {Object.keys(nutrients).map((key) => (
          chartData && (
            <TabsContent value={key} key={key} className="rounded-lg bg-white p-4">
              <ChartContainer config={chartConfig}>
                <BarChart
                  accessibilityLayer
                  data={chartData[key]}
                  layout="vertical"
                  barSize={12}
                  margin={{
                    left: 8,
                    right: 8,
                  }}
                >
                  <YAxis
                    dataKey="nutrients"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    interval={0} // Forces all labels to show
                  />
                  <XAxis type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="value"
                    stackId="b"
                    radius={4}
                    background={<CustomBackground radius={4} />}
                  />
                </BarChart>
              </ChartContainer>
            </TabsContent>
          )
        ))}
      </Tabs>
      </div>
    </div>
  )
}
