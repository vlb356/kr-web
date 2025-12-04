// src/features/leagues/LeagueDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Outlet } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

export default function LeagueDetail() {
    const { leagueId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);

    // Detect current tab from URL
    let tab = "overview";
    if (location.pathname.includes("teams")) tab = "teams";
    if (location.pathname.includes("matches")) tab = "matches";
    if (location.pathname.includes("standings")) tab = "standings";

    useEffect(() => {
        async function loadLeague() {
            try {
                const ref = doc(db, "leagues", leagueId);
                const snap = await getDoc(ref);

                if (!snap.exists()) {
                    setLeague(null);
                } else {
                    setLeague({ id: snap.id, ...snap.data() });
                }
            } catch (error) {
                console.error("Error loading league:", error);
            } finally {
                setLoading(false);
            }
        }

        loadLeague();
    }, [leagueId]);

    // Change tab
    const goTab = (t) => {
        navigate(`/league/${leagueId}/${t}`);
    };

    if (loading) return <div className="p-10">Loading...</div>;
    if (!league) return <div className="p-10">League not found</div>;

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* League Name */}
            <h1 className="text-3xl font-bold mb-6">{league.name}</h1>

            {/* Tabs */}
            <div className="flex gap-2 mt-6">
                <button
                    className={`kr-tab ${tab === "overview" ? "active" : ""}`}
                    onClick={() => goTab("overview")}
                >
                    Overview
                </button>

                <button
                    className={`kr-tab ${tab === "teams" ? "active" : ""}`}
                    onClick={() => goTab("teams")}
                >
                    Teams
                </button>

                <button
                    className={`kr-tab ${tab === "matches" ? "active" : ""}`}
                    onClick={() => goTab("matches")}
                >
                    Matches
                </button>

                <button
                    className={`kr-tab ${tab === "standings" ? "active" : ""}`}
                    onClick={() => goTab("standings")}
                >
                    Standings
                </button>
            </div>

            {/* Content */}
            <div className="mt-10">
                {/* Pass context to child pages */}
                <Outlet context={{ leagueId, league, user }} />
            </div>
        </div>
    );
}
