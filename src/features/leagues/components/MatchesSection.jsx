// src/features/leagues/components/MatchesSection.jsx
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    addDoc,
    doc,
    deleteDoc,
} from "firebase/firestore";

export default function MatchesSection({ leagueId, league, user }) {
    const [matches, setMatches] = useState([]);
    const [teams, setTeams] = useState([]);

    const isOwner = user?.uid === league?.ownerUid;

    useEffect(() => {
        loadTeams();
        loadMatches();
    }, []);

    async function loadTeams() {
        const snap = await getDocs(collection(db, "leagues", leagueId, "teams"));
        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTeams(arr);
    }

    async function loadMatches() {
        const snap = await getDocs(collection(db, "leagues", leagueId, "matches"));
        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMatches(arr);
    }

    async function createMatch() {
        if (teams.length < 2) {
            alert("You need at least 2 teams to create a match!");
            return;
        }

        const teamA = teams[0].id;
        const teamB = teams[1].id;

        await addDoc(collection(db, "leagues", leagueId, "matches"), {
            teamA,
            teamB,
            scoreA: null,
            scoreB: null,
            createdAt: Date.now(),
        });

        loadMatches();
    }

    async function deleteMatch(matchId) {
        await deleteDoc(doc(db, "leagues", leagueId, "matches", matchId));
        loadMatches();
    }

    function getTeamName(id) {
        return teams.find((t) => t.id === id)?.name || "Unknown";
    }

    return (
        <div className="space-y-6">

            {isOwner && (
                <button
                    onClick={createMatch}
                    className="px-4 py-2 bg-[#1662A6] text-white rounded-lg hover:bg-[#124f84]"
                >
                    + Create Match
                </button>
            )}

            {matches.length === 0 && (
                <div className="text-gray-500">No matches created yet.</div>
            )}

            <div className="space-y-4">
                {matches.map((m) => (
                    <div
                        key={m.id}
                        className="bg-white shadow-md border rounded-lg p-4 flex justify-between items-center"
                    >
                        {/* LEFT: Match info */}
                        <div className="flex flex-col text-[#122944]">
                            <span className="text-lg font-semibold">
                                {getTeamName(m.teamA)} <span className="text-[#E96F19]">vs</span> {getTeamName(m.teamB)}
                            </span>

                            {m.scoreA !== null && m.scoreB !== null ? (
                                <span className="text-gray-600 mt-1">
                                    Final Score:{" "}
                                    <span className="font-bold">
                                        {m.scoreA} - {m.scoreB}
                                    </span>
                                </span>
                            ) : (
                                <span className="text-gray-500 mt-1 italic">
                                    No score yet
                                </span>
                            )}
                        </div>

                        {/* RIGHT: Admin buttons */}
                        {isOwner && (
                            <div className="flex gap-2">

                                <button
                                    onClick={() =>
                                        alert("Feature: edit score (pendiente)")
                                    }
                                    className="px-3 py-1 bg-[#1662A6] text-white rounded-md hover:bg-[#124f84]"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteMatch(m.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>

                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
