// src/components/ui/Section.jsx
import React from "react";
import { cn } from "./utils";

export default function Section({ title, subtitle, children, className }) {
    return (
        <section className={cn("py-8", className)}>
            {title && <h2 className="text-2xl font-bold mb-1">{title}</h2>}
            {subtitle && <p className="text-gray-600 mb-4">{subtitle}</p>}

            {children}
        </section>
    );
}
