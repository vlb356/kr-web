// src/components/ui/Button.jsx
import React from "react";
import { cn } from "./utils";

const variants = {
    primary:
        "bg-gray-900 text-white hover:bg-gray-800",
    secondary:
        "bg-white border border-gray-300 text-gray-800 hover:bg-gray-100",
    ghost:
        "bg-transparent text-gray-700 hover:bg-gray-100",
    danger:
        "bg-red-600 text-white hover:bg-red-500",
};

export default function Button({
    variant = "primary",
    children,
    className,
    ...props
}) {
    return (
        <button
            {...props}
            className={cn(
                "px-4 py-2 rounded-xl font-medium shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                className
            )}
        >
            {children}
        </button>
    );
}
