// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Nav from "@/components/nav/Nav";
import ProtectedRoute from "@/components/access/ProtectedRoute";

import Marketing from "@/features/marketing/Marketing";
import Explore from "@/features/explore/Explore";
import Events from "@/features/events/Events";
import CreateEvent from "@/features/events/CreateEvent";
import Leagues from "@/features/leagues/Leagues";
import Social from "@/features/social/Social";

import Subscriptions from "@/features/subscriptions/Subscriptions";

import Auth from "@/features/auth/Auth";
import Profile from "@/features/profile/Profile";
import EditProfile from "@/features/profile/EditProfile";
import ForumDetail from "@/features/social/ForumDetail";
import SearchUsers from "@/features/profile/SearchUsers";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Nav />

        <main className="flex-1">
          <Routes>
            {/* Public */}
            <Route path="/" element={<Marketing />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/auth" element={<Auth />} />

            {/* Protected */}
            <Route path="/profile/:id" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            <Route path="/edit-profile" element={
              <ProtectedRoute><EditProfile /></ProtectedRoute>
            } />

            <Route path="/search" element={
              <ProtectedRoute><SearchUsers /></ProtectedRoute>
            } />

            <Route path="/events" element={
              <ProtectedRoute><Events /></ProtectedRoute>
            } />

            <Route path="/create-event" element={
              <ProtectedRoute><CreateEvent /></ProtectedRoute>
            } />


            <Route path="/social" element={
              <ProtectedRoute><Social /></ProtectedRoute>
            } />

            <Route path="/forum/:id" element={
              <ProtectedRoute><ForumDetail /></ProtectedRoute>
            } />

            {/* Not found */}
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
