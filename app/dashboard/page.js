import Sidebar from "@/components/sidebar";

export default function Dashboard() {
    return (
        <div className="flex bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-4">
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-gray-500">Welcome back, John Doe!</p>
            </main>
        </div>
    );
}
