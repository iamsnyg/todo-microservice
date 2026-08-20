"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SidebarItem({ href, icon: Icon, title }) {
    const pathname = usePathname();

    const active = pathname === href;

    return (
        <Link
            href={href}
            className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            )}
        >
            <Icon
                size={20}
                className={cn(
                    "transition-transform duration-200",
                    !active && "group-hover:scale-110",
                )}
            />

            <span>{title}</span>
        </Link>
    );
}
