"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import SearchBar from "@/components/navigation/SearchBar";
// import NotificationBell from "@/components/navigation/NotificationBell";
import UserDropdown from "@/components/navigation/UserDropdown";
import NotificationBell from "@/components/notifications/NotificationBell";
import MobileSidebar from "./MobileSidebar";
export default function Navbar() {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
            {/* Left */}
            <div className="flex items-center gap-3">
                <MobileSidebar />
                
                <div className="hidden md:block">
                    <SearchBar />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Todo
                </Button>

                <NotificationBell />

                <div className="w-56">
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
}
