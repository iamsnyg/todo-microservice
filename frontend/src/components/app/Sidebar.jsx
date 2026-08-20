"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

import SidebarGroup from "@/components/navigation/SidebarGroup";
import UserDropdown from "@/components/navigation/UserDropdown";
import AppLogo from "./AppLogo";
import { sidebarItems, bottomItems } from "@/lib/sidebar-data";

export default function Sidebar() {
    return (
        <aside className="hidden h-screen w-72 border-r bg-white lg:flex lg:flex-col">
            {/* Logo */}
            <div className="border-b px-6 py-6">
                <AppLogo />
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <SidebarGroup title="MAIN" items={sidebarItems} />

                <Separator className="my-6" />

                <SidebarGroup title="ACCOUNT" items={bottomItems} />
            </div>

            {/* User */}
            <div className="border-t p-4">
                <UserDropdown />
            </div>
        </aside>
    );
}
