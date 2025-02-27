
import DailyProgress from "@/components/dashboard/charts/dailyProgress";
import DailyComposition from "@/components/dashboard/charts/dailyComposition"
import { DailyIntakeProvider } from "@/components/dashboard/dailyIntakeProvider";
import NutrientAnalysis from "@/components/dashboard/charts/nutrientAnalysis";
import RecordView from "@/components/dashboard/charts/recordView";

export default function Dashboard() {
    return (
        <div className="flex bg-gray-100">
            <main className="flex-1 p-4">
                <DailyIntakeProvider>
                <h1 className="text-3xl font-semibold mb-4">Dashboard</h1>
                <DailyProgress />
                <div className="grid grid-cols-3 mt-4 gap-4" >
                <NutrientAnalysis />
                <DailyComposition />
                </div>
                </DailyIntakeProvider>
                <div className="grid grid-cols-3 mt-4 gap-4" >
                <RecordView />
                </div>
            </main>
        </div>
    );
}
