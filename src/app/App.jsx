// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Nav from "@/components/nav/Nav";

// HOME (landing / marketing)
import Marketing from "@/features/marketing/Marketing";

// FEATURES
import Explore from "@/features/explore/Explore";
import Events from "@/features/events/Events";
import Leagues from "@/features/leagues/Leagues";
import Social from "@/features/social/Social";

import Subscriptions from "@/features/subscriptions/Subscriptions";

import Auth from "@/features/auth/Auth";
import Profile from "@/features/profile/Profile";
import EditProfile from "@/features/profile/EditProfile";
import ForumDetail from "@/features/social/ForumDetail";
import SearchUsers from "@/features/profile/SearchUsers";
import CreateEvent from "@/features/events/CreateEvent";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Nav />

        <main className="flex-1">
          <Routes>
            {/* HOME → Marketing page */}
            <Route path="/" element={<Marketing />} />

            {/* EXPLORE (separate page) */}
            <Route path="/explore" element={<Explore />} />

            {/* AUTH */}
            <Route path="/auth" element={<Auth />} />

            <Route path="/subscriptions" element={<Subscriptions />} />
            
            {/* PROFILE */}
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />

            {/* SEARCH USERS */}
            <Route path="/search" element={<SearchUsers />} />

            {/* EVENTS */}
            <Route path="/events" element={<Events />} />
            <Route path="/create-event" element={<CreateEvent />} />


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

        <footer className="text-center text-gray-500 py-6 text-sm">
          Komanda Ryšys — One Pass Sports Platform © 2025
        </footer>
      </div>
    </Router>
  );
}
