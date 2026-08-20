"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function SearchBar() {
    return (
        <div className="relative w-full max-w-md">
            <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <Input placeholder="Search todos..." className="pl-10" />
        </div>
    );
}
