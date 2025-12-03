// src/components/ui/Avatar.jsx
import React from "react";
import { cn } from "./utils";

export default function Avatar({ name, size = "md", className }) {
    const initial = name?.charAt(0)?.toUpperCase() || "U";

    const sizes = {
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-14 w-14 text-xl",
    };

    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-full bg-gray-900 text-white font-medium",
                sizes[size],
                className
            )}
        >
            {initial}
        </div>
    );
}
