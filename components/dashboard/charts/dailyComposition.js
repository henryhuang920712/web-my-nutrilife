"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useDailyIntake } from '../dailyIntakeProvider';

const chartData = [
  { browser: "chrome", visitors: 275, a: 53},
  { browser: "safari", visitors: 200, a: 53 },
  { browser: "firefox", visitors: 187, a: 53},
  { browser: "edge", visitors: 173, a: 53},
  { browser: "other", visitors: 90, a: 53},
]



const chartConfig = {
  visitors: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  a: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
}

export default function DailyComposition({ }) {
  const dailyIntake = useDailyIntake();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-[100px] mt-4" >
      <div className="px-4 rounded-2xl shadow-sm bg-white flex gap-4 items-center p-2">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value]?.label
              }
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="visitors" stackId="b" layout="vertical" fill="var(--color-desktop)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="a" stackId="b" layout="vertical" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  )
}
