// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Nav from "@/components/nav/Nav";

// FEATURES
import Explore from "@/features/explore/Explore";
import Events from "@/features/events/Events";
import Leagues from "@/features/leagues/Leagues";
import Social from "@/features/social/Social";

import Auth from "@/features/auth/Auth";
import Profile from "@/features/profile/Profile";
import EditProfile from "@/features/profile/EditProfile";
import ForumDetail from "@/features/social/ForumDetail";
import { Home } from "lucide-react";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* TOP NAV */}
        <Nav />

        {/* MAIN CONTENT */}
        <main className="flex-1">
          <Routes>
            {/* HOME */}
            <Route path="lucide-react" element={<Home />} />

            {/* EXPLORE */}
            <Route path="/explore" element={<Explore />} />

            {/* AUTH */}
            <Route path="/auth" element={<Auth />} />

            {/* PROFILE */}
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />

            {/* EVENTS */}
            <Route path="/events" element={<Events />} />

            {/* LEAGUES */}
            <Route path="/leagues" element={<Leagues />} />

            {/* SOCIAL / FORUMS */}
            <Route path="/social" element={<Social />} />
            <Route path="/forum/:id" element={<ForumDetail />} />

            {/* FALLBACK */}
            <Route
              path="*"
              element={
                <div className="p-10 text-center text-xl text-gray-600">
                  Page not found.
                </div>
              }
            />
          </Routes>
        </main>

        {/* FOOTER */}
        <footer className="text-center text-gray-500 py-6 text-sm">
          Komanda Ryšys — One Pass Sports Platform © 2025
        </footer>
      </div>
    </Router>
  );
}
