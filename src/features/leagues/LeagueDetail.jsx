// src/features/leagues/LeagueDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

import useAuth from "@/hooks/useAuth";

// SECCIONES
import OverviewSection from "./components/OverviewSection";
import TeamsSection from "./components/TeamsSection";
import MatchesSection from "./components/MatchesSection";
import StandingsSection from "./components/StandingsSection";

export default function LeagueDetail() {
    const { leagueId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Detect current tab
    let tab = "overview";
    if (location.pathname.includes("teams")) tab = "teams";
    if (location.pathname.includes("matches")) tab = "matches";
    if (location.pathname.includes("standings")) tab = "standings";

    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);

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
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }

        loadLeague();
    }, [leagueId]);

    const goTab = (t) => {
        navigate(`/league/${leagueId}/${t}`);
    };

    if (loading) return <div className="p-10 text-[#122944]">Loading...</div>;
    if (!league) return <div className="p-10 text-red-500">League not found</div>;

    return (
        <div className="max-w-4xl mx-auto py-10">

            {/* BUTTON BACK */}
            <button
                onClick={() => navigate("/leagues")}
                className="text-[#1662A6] hover:underline mb-4"
            >
                ← Back to leagues
            </button>

            {/* TITLE */}
            <h1 className="text-3xl font-bold text-[#122944] mb-6">
                {league.name}
            </h1>

            {/* NAV TABS */}
            <div className="flex gap-2 mb-10">
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

            {/* CONTENT */}
            {tab === "overview" && <OverviewSection league={league} />}
            {tab === "teams" && (
                <TeamsSection leagueId={leagueId} league={league} user={user} />
            )}
            {tab === "matches" && (
                <MatchesSection leagueId={leagueId} league={league} user={user} />
            )}
            {tab === "standings" && (
                <StandingsSection leagueId={leagueId} league={league} />
            )}
        </div>
    );
}
