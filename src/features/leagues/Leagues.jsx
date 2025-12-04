// src/features/leagues/Leagues.jsx
import React from "react";
import { FaPlus, FaUsers, FaTrophy } from "react-icons/fa";

export default function Leagues() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-14">

            <h1 className="text-4xl font-bold text-[#122944] mb-2">
                Leagues & Tournaments
            </h1>

            <p className="text-gray-600 mb-10">
                Organize competitions, create teams, track results and rankings.
            </p>

            <div className="grid md:grid-cols-3 gap-8">

                <a href="#/create-league" className="block p-6 border rounded-2xl shadow hover:shadow-lg transition bg-white">
                    <FaPlus className="text-[#E96F19] text-3xl mb-3" />
                    <h2 className="text-xl font-semibold text-[#122944]">Create League</h2>
                    <p className="text-gray-500 text-sm">Start a new competition from scratch.</p>
                </a>

                <a href="#/my-leagues" className="block p-6 border rounded-2xl shadow hover:shadow-lg transition bg-white">
                    <FaUsers className="text-[#1662A6] text-3xl mb-3" />
                    <h2 className="text-xl font-semibold text-[#122944]">My Leagues</h2>
                    <p className="text-gray-500 text-sm">View and manage your leagues.</p>
                </a>

                <a href="#/all-leagues" className="block p-6 border rounded-2xl shadow hover:shadow-lg transition bg-white">
                    <FaTrophy className="text-[#122944] text-3xl mb-3" />
                    <h2 className="text-xl font-semibold text-[#122944]">All Leagues</h2>
                    <p className="text-gray-500 text-sm">Explore all public tournaments.</p>
                </a>

            </div>
        </div>
    );
}
