// src/components/Nav.jsx
import React, { useState } from "react";
import { auth } from "@/lib/firebase";
import KRLogo from "@/assets/logos/kr-logo.png";

export default function Nav() {
  const user = auth.currentUser;
  const [open, setOpen] = useState(false);

  const initial =
    user?.displayName?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase() ||
    "U";

  return (
    <nav className="w-full border-b border-gray-200 bg-white/70 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* LEFT: Logo */}
        <a href="#/" className="flex items-center gap-2">
          <img src={KRLogo} alt="KR logo" className="h-8 w-8" />
          <span className="font-bold text-xl tracking-tight">Komanda Ryšys</span>
        </a>

        {/* RIGHT: Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink href="#/explore" label="Explore" />
          <NavLink href="#/events" label="Events" />
          <NavLink href="#/leagues" label="Leagues" />
          <NavLink href="#/social" label="Social" />

          {user ? (
            <a
              href={`#/profile/${user.uid}`}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gray-900 text-white text-sm font-semibold"
            >
              {initial}
            </a>
          ) : (
            <a href="#/auth" className="kr-btn px-4 py-1.5">
              Login
            </a>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden h-10 w-10 flex items-center justify-center rounded-md hover:bg-gray-100"
        >
          <svg
            width="24"
            height="24"
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white p-4 space-y-4">
          <MobileLink href="#/" label="Home" />
          <MobileLink href="#/explore" label="Explore" />
          <MobileLink href="#/events" label="Events" />
          <MobileLink href="#/leagues" label="Leagues" />
          <MobileLink href="#/social" label="Social" />

          {user ? (
            <a
              href={`#/profile/${user.uid}`}
              className="flex items-center gap-3 py-2 text-gray-800"
            >
              <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold">
                {initial}
              </div>
              <span>{user.email}</span>
            </a>
          ) : (
            <a
              href="#/auth"
              className="block kr-btn-primary text-center py-2 rounded-xl"
            >
              Login
            </a>
          )}
        </div>
      )}
    </nav>
  );
}

function NavLink({ href, label }) {
  return (
    <a
      href={href}
      className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
    >
      {label}
    </a>
  );
}

function MobileLink({ href, label }) {
  return (
    <a href={href} className="block py-2 text-gray-800 text-sm font-medium">
      {label}
    </a>
  );
}
