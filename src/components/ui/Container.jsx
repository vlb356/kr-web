// src/components/ui/Container.jsx
import React from "react";
import { cn, fadeIn } from "./utils";

export default function Container({ children, className }) {
    return (
        <div
            className={cn(
                "mx-auto max-w-6xl px-4 py-8",
                fadeIn,
                className
            )}
        >
            {children}
        </div>
    );
}
