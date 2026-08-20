"use client";

import { useEffect } from "react";

import { getCurrentUser } from "@/services/auth.service";

import { useAuthStore } from "@/store/auth.store";

export default function AuthProvider({ children }) {
    const setUser = useAuthStore((state) => state.setUser);

    const setLoading = useAuthStore((state) => state.setLoading);

    useEffect(() => {
        async function checkAuth() {
            try {
                setLoading(true);

                const response = await getCurrentUser();

                setUser(response.data);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [setLoading, setUser]);

    return children;
}
