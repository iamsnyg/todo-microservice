"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

export default function GuestRoute({ children }) {
    const router = useRouter();

    const { isAuthenticated, loading } = useAuthStore();

    useEffect(() => {
        if (!loading && isAuthenticated) {
            router.replace("/dashboard");
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return children;
}
