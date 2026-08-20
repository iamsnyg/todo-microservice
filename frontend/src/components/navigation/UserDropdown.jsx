"use client";

import { useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth.store";
import { logout } from "@/services/auth.service";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function UserDropdown() {
    const router = useRouter();

    const { user, logout: clearAuth } = useAuthStore();

    async function handleLogout() {
        try {
            await logout();

            clearAuth();

            toast.success("Logged out successfully");

            router.replace("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger >
                <div className="flex w-full items-center justify-between rounded-xl p-2 transition hover:bg-slate-100">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>
                                {user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="text-left">
                            <p className="text-sm font-semibold">
                                {user?.name}
                            </p>

                            <p className="text-xs text-slate-500">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    <ChevronDown size={18} />
                </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
