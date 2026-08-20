import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppLayout from "@/components/app/AppLayout";

export default function DashboardLayout({ children }) {
    return (
        <ProtectedRoute>
            <AppLayout>{children}</AppLayout>
        </ProtectedRoute>
    );
}
