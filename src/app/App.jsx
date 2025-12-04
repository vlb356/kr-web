// src/App.jsx
import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Nav from "@/components/nav/Nav";
import ProtectedRoute from "@/components/access/ProtectedRoute";

// Marketing & Auth
import Marketing from "@/features/marketing/Marketing";
import Auth from "@/features/auth/Auth";
import Subscriptions from "@/features/subscriptions/Subscriptions";

// Explore & Events
import Explore from "@/features/explore/Explore";
import Events from "@/features/events/Events";
import CreateEvent from "@/features/events/CreateEvent";

// Profile
import Profile from "@/features/profile/Profile";
import EditProfile from "@/features/profile/EditProfile";
import SearchUsers from "@/features/profile/SearchUsers";

// Social
import Social from "@/features/social/Social";
import ForumDetail from "@/features/social/ForumDetail";

// LEAGUES MODULE
import LeagueHome from "@/features/leagues/LeagueHome";
import CreateLeague from "@/features/leagues/CreateLeague";
import LeagueDetail from "@/features/leagues/LeagueDetail";
import TeamDetail from "@/features/leagues/TeamDetail";
import PasswordGate from "@/features/leagues/PasswordGate";

// LEAGUE SUBPAGES (nested)
import OverviewSection from "@/features/leagues/components/OverviewSection";
import TeamsSection from "@/features/leagues/components/TeamsSection";
import MatchesSection from "@/features/leagues/components/MatchesSection";
import StandingsSection from "@/features/leagues/components/StandingsSection";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* NAV */}
        <Nav />

        <main className="flex-1">
          <Routes>

            {/* ---------------------- */}
            {/* PUBLIC ROUTES          */}
            {/* ---------------------- */}

            <Route path="/" element={<Marketing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/explore" element={<Explore />} />

            {/* ---------------------- */}
            {/* PROFILE                */}
            {/* ---------------------- */}

            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchUsers />
                </ProtectedRoute>
              }
            />

            {/* ---------------------- */}
            {/* EVENTS                 */}
            {/* ---------------------- */}

            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-event"
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />

            {/* ---------------------- */}
            {/* LEAGUES MODULE         */}
            {/* ---------------------- */}

            <Route
              path="/leagues"
              element={
                <ProtectedRoute>
                  <LeagueHome />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-league"
              element={
                <ProtectedRoute>
                  <CreateLeague />
                </ProtectedRoute>
              }
            />

            {/* PASSWORD */}
            <Route
              path="/league/:leagueId/password"
              element={
                <ProtectedRoute>
                  <PasswordGate />
                </ProtectedRoute>
              }
            />

            {/* --- MAIN LEAGUE LAYOUT --- */}
            <Route
              path="/league/:leagueId"
              element={
                <ProtectedRoute>
                  <LeagueDetail />
                </ProtectedRoute>
              }
            >
              {/* Nested routes */}
              <Route path="overview" element={<OverviewSection />} />
              <Route path="teams" element={<TeamsSection />} />
              <Route path="matches" element={<MatchesSection />} />
              <Route path="standings" element={<StandingsSection />} />
            </Route>

            {/* TEAM DETAIL (NO CAMBIA NADA) */}
            <Route
              path="/league/:leagueId/team/:teamId"
              element={
                <ProtectedRoute>
                  <TeamDetail />
                </ProtectedRoute>
              }
            />

            {/* ---------------------- */}
            {/* SOCIAL                 */}
            {/* ---------------------- */}

            <Route
              path="/social"
              element={
                <ProtectedRoute>
                  <Social />
                </ProtectedRoute>
              }
            />

            <Route
              path="/forum/:id"
              element={
                <ProtectedRoute>
                  <ForumDetail />
                </ProtectedRoute>
              }
            />

            {/* ---------------------- */}
            {/* 404                    */}
            {/* ---------------------- */}

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
