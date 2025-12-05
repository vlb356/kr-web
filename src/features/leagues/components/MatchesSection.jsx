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
import TeamLogo from "./TeamLogo";

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

        await addDoc(collection(db, "leagues", leagueId, "matches"), {
            teamA: teams[0].id,
            teamB: teams[1].id,
            scoreA: null,
            scoreB: null,
            createdAt: Date.now(),
        });

        loadMatches();
    }

    async function deleteMatch(id) {
        await deleteDoc(doc(db, "leagues", leagueId, "matches", id));
        loadMatches();
    }

    function getTeam(id) {
        return teams.find((t) => t.id === id);
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
                <div className="text-gray-500 italic">No matches created yet.</div>
            )}

            <div className="space-y-6">
                {matches.map((m) => {
                    const A = getTeam(m.teamA);
                    const B = getTeam(m.teamB);

                    return (
                        <div
                            key={m.id}
                            className="
                                bg-white 
                                shadow-lg 
                                border 
                                rounded-xl 
                                p-6 
                                max-w-3xl 
                                mx-auto 
                                flex 
                                items-center 
                                justify-between
                            "
                        >

                            {/* CENTER: A — VS — B */}
                            <div className="flex items-center justify-center gap-10 flex-1">

                                {/* TEAM A */}
                                <div className="flex flex-col items-center text-center">
                                    <TeamLogo initials={A?.initials} color={A?.color} size={55} />
                                    <span className="mt-2 font-semibold text-[#122944]">
                                        {A?.name}
                                    </span>
                                </div>

                                {/* SCORE + VS */}
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <span className="text-[#E96F19] text-lg font-bold">VS</span>

                                    {m.scoreA !== null && m.scoreB !== null ? (
                                        <span className="text-2xl font-bold text-[#122944]">
                                            {m.scoreA} - {m.scoreB}
                                        </span>
                                    ) : (
                                        <span className="text-gray-500 text-sm italic">No score</span>
                                    )}
                                </div>

                                {/* TEAM B */}
                                <div className="flex flex-col items-center text-center">
                                    <TeamLogo initials={B?.initials} color={B?.color} size={55} />
                                    <span className="mt-2 font-semibold text-[#122944]">
                                        {B?.name}
                                    </span>
                                </div>
                            </div>

                            {/* BUTTONS RIGHT */}
                            {isOwner && (
                                <div className="flex flex-col gap-2 ml-6">

                                    <button
                                        onClick={() => alert("Edit modal soon")}
                                        className="px-4 py-1 bg-[#1662A6] text-white rounded-md hover:bg-[#124f84]"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteMatch(m.id)}
                                        className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                                    >
                                        Delete
                                    </button>

                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
