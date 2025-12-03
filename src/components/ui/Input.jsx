// src/components/ui/Input.jsx
import React from "react";
import { cn } from "./utils";

export default function Input({ iconLeft, className, ...props }) {
    return (
        <div className="relative">
            {iconLeft && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    {iconLeft}
                </span>
            )}

            <input
                {...props}
                className={cn(
                    "w-full rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-gray-300",
                    iconLeft && "pl-10",
                    className
                )}
            />
        </div>
    );
}
