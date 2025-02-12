


import { CaloriesPeriod } from "@/components/dashboard/charts/caloriesPeriodBar";
import DailyProgress from "@/components/dashboard/charts/dailyProgress";
import DailyComposition from "@/components/dashboard/charts/dailyComposition"
import { DailyIntakeProvider } from "@/components/dashboard/dailyIntakeProvider";
export default function Dashboard() {
    return (
        <div className="flex bg-gray-100">
            <main className="flex-1 p-4">
                <DailyIntakeProvider>
                <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
                <DailyProgress />
                <DailyComposition />
                </DailyIntakeProvider>
            </main>
        </div>
    );
}
