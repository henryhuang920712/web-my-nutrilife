"use client"
import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"
import Image from "next/image";
import { 
  ChartConfig, 
  ChartContainer,
} from "@/components/ui/chart"
import { useDailyIntake } from '../dailyIntakeProvider';

export default function DailyProgress() {
  const dailyIntake = useDailyIntake();

  const displayedNutrients = {
    "熱量": "calories",
    "總碳水化合物": "carbonhydrates",
    "膳食纖維": "fiber",
  }

  const colors = ["1", "2", "3"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dailyIntake &&  dailyIntake.length > 0 ? (dailyIntake.map((nutrient, index) => {
          if (nutrient.n_name in displayedNutrients) {
            return (
              <SmallDailyProgress
                key={index}
                nutrientName={displayedNutrients[nutrient.n_name]}
                intake={nutrient.n_consumed_amount}
                suggIntake={nutrient.n_sugg_amount}
                unit={nutrient.n_unit}
                color={colors[index]}
              />
            )
          }
      }))
    : null
    }
    </div>
  )
}



// only the first 3 nutrients have suggested intake
function SmallDailyProgress({nutrientName, intake, suggIntake, unit, color}) {

  const chartData = [
    { nutrient: nutrientName, intake: intake, fill: `var(--color-nutrientName)` },
  ]
  const chartConfig = {
    intake: {
      label: "Intake",
    },
    nutrientName: {
      label: nutrientName,
      color: `hsl(var(--chart-${color}))`,
    }
  }
  
  const intakeRatio = suggIntake == 0 ? 0 : (intake / suggIntake) * 100

  return (
    <div className="px-4 rounded-2xl shadow-sm bg-white flex gap-4 items-center">
      <div className="">
        <Image
          src={`/dashboard/daily_progress/${nutrientName}.png`}
          alt={nutrientName}
          width={50}
          height={50}
          className="max-w-full max-h-full object-contain"

        />
        </div>
      <div className="p-4">
        <div className="text-3xl font-bold">
          {intake} {unit}
        </div>
        <div>
          <span className="text-sm text-gray-500 uppercase">{nutrientName}</span>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-[125px]"
      >
        <RadialBarChart

          data={chartData}
          endAngle={(intakeRatio / 100) * 360}
          innerRadius={40}
          outerRadius={70}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[43, 37]}
          />
          <RadialBar dataKey="intake" background />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-base font-bold"
                      >
                        {intakeRatio.toFixed(0)}%
                      </tspan>
                      {/* <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Visitors
                      </tspan> */}
                    </text>
                  )
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  )
}

