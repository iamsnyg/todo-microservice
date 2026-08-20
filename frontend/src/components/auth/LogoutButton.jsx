"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { logout } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function LogoutButton() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    const clearAuth = useAuthStore((state) => state.logout);

    async function handleLogout() {
        try {
            setLoading(true);

            await logout();

            clearAuth();

            toast.success("Logged out successfully");

            router.replace("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button variant="destructive" onClick={handleLogout} disabled={loading}>
            {loading ? "Logging out..." : "Logout"}
        </Button>
    );
}
