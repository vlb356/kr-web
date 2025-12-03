// src/components/ui/Badge.jsx
import React from "react";
import { cn } from "./utils";

const variants = {
    gray: "bg-gray-100 text-gray-700 border-gray-300",
    blue: "bg-blue-100 text-blue-700 border-blue-300",
    green: "bg-green-100 text-green-700 border-green-300",
    red: "bg-red-100 text-red-700 border-red-300",
    amber: "bg-amber-100 text-amber-700 border-amber-300",
};

export default function Badge({ variant = "gray", children, className }) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
