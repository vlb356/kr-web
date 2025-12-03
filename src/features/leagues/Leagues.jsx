// src/features/leagues/Leagues.jsx
import React from "react";

export default function Leagues() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-14">

            <h1 className="text-4xl font-bold text-[#122944] mb-6">
                Leagues & Tournaments
            </h1>

            <p className="text-gray-600 text-lg mb-10">
                Manage your leagues, teams, matches and standings.
            </p>

            <div className="grid md:grid-cols-3 gap-8">

                {/* Create League */}
                <a
                    href="#/create-league"
                    className="block p-6 rounded-2xl border shadow-sm hover:shadow-md transition bg-white"
                >
                    <h2 className="text-xl font-semibold text-[#122944] mb-2">Create League</h2>
                    <p className="text-gray-500 text-sm">Start a new tournament</p>
                </a>

                {/* My Leagues */}
                <a
                    href="#/league-home"
                    className="block p-6 rounded-2xl border shadow-sm hover:shadow-md transition bg-white"
                >
                    <h2 className="text-xl font-semibold text-[#122944] mb-2">My Leagues</h2>
                    <p className="text-gray-500 text-sm">View and manage your leagues</p>
                </a>

                {/* Standings */}
                <a
                    href="#/league-standings"
                    className="block p-6 rounded-2xl border shadow-sm hover:shadow-md transition bg-white"
                >
                    <h2 className="text-xl font-semibold text-[#122944] mb-2">Standings</h2>
                    <p className="text-gray-500 text-sm">View ranking tables</p>
                </a>

                {/* Matches */}
                <a
                    href="#/league-matches"
                    className="block p-6 rounded-2xl border shadow-sm hover:shadow-md transition bg-white"
                >
                    <h2 className="text-xl font-semibold text-[#122944] mb-2">Matches</h2>
                    <p className="text-gray-500 text-sm">See schedules and results</p>
                </a>

                {/* Teams */}
                <a
                    href="#/league-teams"
                    className="block p-6 rounded-2xl border shadow-sm hover:shadow-md transition bg-white"
                >
                    <h2 className="text-xl font-semibold text-[#122944] mb-2">Teams</h2>
                    <p className="text-gray-500 text-sm">Manage participating teams</p>
                </a>

                {/* Register Match */}
                <a
                    href="#/register-match"
                    className="block p-6 rounded-2xl border shadow-sm hover:shadow-md transition bg-white"
                >
                    <h2 className="text-xl font-semibold text-[#122944] mb-2">Register Match</h2>
                    <p className="text-gray-500 text-sm">Input match results</p>
                </a>

            </div>
        </div>
    );
}
