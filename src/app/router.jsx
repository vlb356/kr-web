// src/app/router.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Marketing from "@/features/marketing/Marketing";

import Explore from "@/features/explore/Explore";
import Events from "@/features/events/Events";

import Social from "@/features/social/Social";
import ForumDetail from "@/features/social/ForumDetail";
import Topic from "@/features/social/Topic";

import Leagues from "@/features/leagues/Leagues";
import LeagueDetail from "@/features/leagues/LeagueDetail";

import Profile from "@/features/profile/Profile";
import Auth from "@/features/auth/Auth";
import Subscribe from "@/features/subscribe/Subscribe";

import { Container } from "@/components/ui";

export default function AppRouter({ user, sub }) {
    return (
        <Routes>
            {/* MARKETING / HOME */}
            <Route path="/" element={<Marketing />} />

            {/* EXPLORE */}
            <Route path="/explore" element={<Explore />} />

            {/* EVENTS */}
            <Route path="/events" element={<Events user={user} sub={sub} />} />

            {/* SOCIAL */}
            <Route path="/social" element={<Social user={user} />} />
            <Route path="/forum/:id" element={<ForumDetail />} />
            <Route path="/topic/:id" element={<Topic />} />

            {/* LEAGUES */}
            <Route path="/leagues" element={<Leagues />} />
            <Route path="/league/:id" element={<LeagueDetail sub={sub} />} />

            {/* PROFILE */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:uid" element={<Profile />} />

            {/* AUTH + SUBSCRIBE */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/subscribe" element={<Subscribe />} />

            {/* 404 */}
            <Route
                path="*"
                element={
                    <Container>
                        <div className="kr-card text-center">
                            <h2 className="text-xl font-bold mb-2">Page not found</h2>
                            <a href="#/" className="kr-btn">Go to Home</a>
                        </div>
                    </Container>
                }
            />
        </Routes>
    );
}
