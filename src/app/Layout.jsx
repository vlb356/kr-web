// src/app/Layout.jsx
import React from "react";
import Nav from "@/components/nav/Nav";

export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* NAV */}
            <Nav />

            {/* CONTENT */}
            <main className="flex-1">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="mt-10 py-10 text-center text-gray-500 text-sm border-t border-gray-200">
                <p>Komanda Ryšys — One Pass Sports Platform © 2025</p>
            </footer>
        </div>
    );
}
