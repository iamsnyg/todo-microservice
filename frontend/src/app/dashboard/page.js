import WelcomeCard from "@/components/dashboard/WelcomeCard";
import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentTodos from "@/components/dashboard/RecentTodos";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <WelcomeCard />

            <DashboardStats />

            <div className="grid gap-6 lg:grid-cols-2">
                <RecentTodos />

                <ActivityFeed />
            </div>
        </div>
    );
}
