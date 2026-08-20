"use client";

import SidebarItem from "./SidebarItem";

export default function SidebarGroup({ title, items }) {
    return (
        <div className="space-y-2">
            {title && (
                <h3 className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {title}
                </h3>
            )}

            <div className="space-y-1">
                {items.map((item) => (
                    <SidebarItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        title={item.title}
                    />
                ))}
            </div>
        </div>
    );
}
