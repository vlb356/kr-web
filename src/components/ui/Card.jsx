// src/components/ui/Card.jsx
import React from "react";
import { cn, fadeIn } from "./utils";

export default function Card({ padding = "lg", className, children }) {
    const pad = {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
    }[padding];

    return (
        <div
            className={cn(
                "rounded-2xl border border-gray-200 bg-white shadow-sm",
                pad,
                fadeIn,
                className
            )}
        >
            {children}
        </div>
    );
}
