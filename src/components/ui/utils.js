// src/components/ui/utils.js

// Merge classes
export function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

// Small fade animation for some components
export const fadeIn = "animate-[fadeIn_0.25s_ease-in]";
