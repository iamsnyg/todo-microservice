"use client";

import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";

import AppLogo from "./AppLogo";

import SidebarGroup from "@/components/navigation/SidebarGroup";
import UserDropdown from "@/components/navigation/UserDropdown";

import {
    sidebarItems,
    bottomItems,
} from "@/lib/sidebar-data";

export default function MobileSidebar() {
    return (
        <Sheet>
            <SheetTrigger
                render={
                    <Button variant="ghost" size="icon" className="lg:hidden" />
                }
            >
                <Menu className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent side="left" className="flex w-72 flex-col p-0">
                <div className="border-b p-6">
                    <AppLogo />
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <SidebarGroup title="MAIN" items={sidebarItems} />

                    <div className="my-6 border-t" />

                    <SidebarGroup title="ACCOUNT" items={bottomItems} />
                </div>

                <div className="border-t p-4">
                    <UserDropdown />
                </div>
            </SheetContent>
        </Sheet>
    );
}