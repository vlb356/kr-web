import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function TeamsSection({ leagueId, league, user }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadTeams();
    }, [leagueId]);

    async function loadTeams() {
        try {
            const ref = collection(db, "leagues", leagueId, "teams");
            const snap = await getDocs(ref);

            const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setTeams(arr);
        } catch (err) {
            console.error("Error loading teams:", err);
        }
        setLoading(false);
    }

    async function createTeam() {
        const name = prompt("Team name:");

        if (!name) return;

        const initials = name
            .split(" ")
            .map((x) => x[0]?.toUpperCase())
            .join("")
            .slice(0, 3);

        await addDoc(collection(db, "leagues", leagueId, "teams"), {
            name,
            initials,
            color: "#1662A6",
            createdAt: Timestamp.now(),
            members: [user.uid],
        });

        loadTeams();
    }

    if (loading) return <div className="p-6 text-[#122944]">Loading...</div>;

    return (
        <div className="space-y-6">

            {/* CREATE TEAM BUTTON (Only owner) */}
            {user.uid === league.ownerUid && (
                <button
                    onClick={createTeam}
                    className="px-4 py-2 bg-[#1662A6] text-white rounded-lg shadow hover:bg-[#124f84]"
                >
                    + Create Team
                </button>
            )}

            {/* TEAMS LIST */}
            {teams.length === 0 ? (
                <div className="text-gray-500">No teams created yet.</div>
            ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                    {teams.map((t) => (
                        <div
                            key={t.id}
                            onClick={() => navigate(`/league/${leagueId}/team/${t.id}`)}
                            className="cursor-pointer bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                                    style={{ backgroundColor: t.color || "#1662A6" }}
                                >
                                    {t.initials}
                                </div>

                                <div>
                                    <div className="font-bold text-[#122944]">{t.name}</div>
                                    <div className="text-sm text-gray-500">{t.members?.length || 0} players</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
