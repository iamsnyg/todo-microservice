import {
    LayoutDashboard,
    CheckSquare,
    CalendarDays,
    Star,
    CheckCheck,
    Bell,
    Settings,
    UserCircle2,
} from "lucide-react";

export const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "My Todos",
        href: "/todos",
        icon: CheckSquare,
    },
    {
        title: "Today",
        href: "/todos/today",
        icon: CalendarDays,
    },
    {
        title: "Important",
        href: "/todos/important",
        icon: Star,
    },
    {
        title: "Completed",
        href: "/todos/completed",
        icon: CheckCheck,
    },
];

export const bottomItems = [
    {
        title: "Notifications",
        href: "/notifications",
        icon: Bell,
    },
    {
        title: "Profile",
        href: "/profile",
        icon: UserCircle2,
    },
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
];
