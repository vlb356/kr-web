// src/features/leagues/components/TeamsSection.jsx
import { useEffect, useState } from "react";
import {
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";
import AddTeamModal from "./AddTeamModal";
import useAuth from "@/hooks/useAuth";

export default function TeamsSection({ leagueId, league }) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);

    useEffect(() => {
        loadTeams();
    }, []);

    async function loadTeams() {
        try {
            const ref = collection(db, "leagues", leagueId, "teams");
            const snap = await getDocs(ref);

            const items = snap.docs.map((d) => {
                const data = d.data();
                return {
                    id: d.id,
                    ...data,
                    members: Array.isArray(data.members) ? data.members : [],
                    maxPlayers: data.maxPlayers || 10,
                };
            });

            setTeams(items);
        } catch (err) {
            console.error("Error loading teams:", err);
        } finally {
            setLoading(false);
        }
    }

    async function joinTeam(teamId) {
        if (!user?.uid) return;

        try {
            const teamRef = doc(db, "leagues", leagueId, "teams", teamId);
            const snap = await getDoc(teamRef);

            if (!snap.exists()) return;

            const data = snap.data();
            let members = Array.isArray(data.members) ? data.members : [];

            if (members.includes(user.uid)) return;

            members = [...members, user.uid];

            await updateDoc(teamRef, { members });
            await loadTeams();
        } catch (err) {
            console.error("Join error:", err);
        }
    }

    async function leaveTeam(teamId) {
        if (!user?.uid) return;

        try {
            const teamRef = doc(db, "leagues", leagueId, "teams", teamId);
            const snap = await getDoc(teamRef);

            if (!snap.exists()) return;

            const data = snap.data();
            let members = Array.isArray(data.members) ? data.members : [];

            // Si no estaba dentro, no hacemos nada
            if (!members.includes(user.uid)) return;

            members = members.filter((m) => m !== user.uid);

            await updateDoc(teamRef, { members });
            await loadTeams();
        } catch (err) {
            console.error("Leave error:", err);
        }
    }

    if (loading) return <div>Loading…</div>;

    return (
        <div className="mt-6">
            {/* TOP BAR */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Teams</h2>

                {user?.uid === league.ownerUid && (
                    <button
                        onClick={() => setShowAdd(true)}
                        className="px-4 py-2 bg-[#1662A6] text-white rounded-lg shadow"
                    >
                        + Create team
                    </button>
                )}
            </div>

            {/* TEAM LIST */}
            <div className="flex flex-col gap-4">
                {teams.map((team) => {
                    const isJoined = team.members.includes(user?.uid);
                    const isFull = team.members.length >= team.maxPlayers;

                    return (
                        <div
                            key={team.id}
                            className="flex justify-between items-center bg-white p-4 rounded-lg shadow cursor-pointer hover:bg-gray-50 transition"
                            onClick={() => navigate(`/league/${leagueId}/team/${team.id}`)}
                        >
                            {/* LEFT */}
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow"
                                    style={{ backgroundColor: team.color || "#1662A6" }}
                                >
                                    {(team.initials || team.name || "?")
                                        .toString()
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>

                                <div>
                                    <div className="font-semibold">{team.name}</div>
                                    <div className="text-xs text-gray-500">
                                        {team.members.length} players · Max {team.maxPlayers}
                                    </div>
                                    {team.description && (
                                        <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                                            {team.description}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT: JOIN / LEAVE */}
                            <div className="flex items-center">
                                {!isJoined && !isFull && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            joinTeam(team.id);
                                        }}
                                        className="px-4 py-2 bg-[#1662A6] text-white rounded-lg text-sm"
                                    >
                                        Join
                                    </button>
                                )}

                                {isJoined && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            leaveTeam(team.id);
                                        }}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm"
                                    >
                                        Leave
                                    </button>
                                )}

                                {isFull && !isJoined && (
                                    <span className="text-red-500 text-sm px-3">Full</span>
                                )}
                            </div>
                        </div>
                    );
                })}

                {teams.length === 0 && (
                    <p className="text-gray-500 text-center mt-6">
                        No teams created yet.
                    </p>
                )}
            </div>

            {showAdd && (
                <AddTeamModal
                    leagueId={leagueId}
                    onClose={() => setShowAdd(false)}
                    onCreated={loadTeams}
                />
            )}
        </div>
    );
}
