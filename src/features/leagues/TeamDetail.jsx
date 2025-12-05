// src/features/leagues/TeamDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function TeamDetail() {
    const { leagueId, teamId } = useParams();

    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const ref = doc(db, "leagues", leagueId, "teams", teamId);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                setTeam(null);
                return;
            }

            const data = snap.data();
            setTeam(data);

            const list = [];
            for (const uid of data.members || []) {
                const uref = doc(db, "users", uid);
                const usnap = await getDoc(uref);
                list.push({
                    uid,
                    displayName: usnap.exists() ? usnap.data().displayName : "Unknown",
                });
            }
            setPlayers(list);
        } catch (err) {
            console.error("Error loading team:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-6">Loading...</div>;
    if (!team) return <div className="p-6 text-red-500">Team not found</div>;

    return (
        <div className="p-8 max-w-3xl mx-auto">
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-6">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shadow"
                    style={{ backgroundColor: team.color || "#1662A6" }}
                >
                    {(team.initials || team.name || "?")
                        .toString()
                        .slice(0, 2)
                        .toUpperCase()}
                </div>

                <div>
                    <h1 className="text-3xl font-bold">{team.name}</h1>
                    <p className="text-gray-600 mt-1">
                        {team.description || "No description yet."}
                    </p>
                </div>
            </div>

            {/* INFO BOX */}
            <div className="bg-white rounded-lg p-4 shadow mb-8">
                <p>
                    <strong>Players:</strong> {players.length} / {team.maxPlayers}
                </p>
                {team.createdAt?.toDate && (
                    <p className="mt-2 text-sm text-gray-500">
                        Created on: {team.createdAt.toDate().toLocaleString()}
                    </p>
                )}
            </div>

            {/* PLAYERS LIST */}
            <h2 className="text-xl font-semibold mb-3">Players</h2>

            <div className="flex flex-col gap-2">
                {players.map((p) => (
                    <div
                        key={p.uid}
                        className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg shadow-sm"
                    >
                        <div className="w-10 h-10 bg-[#1662A6] rounded-full flex items-center justify-center text-white font-semibold">
                            {p.displayName?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                            <div className="font-semibold">{p.displayName}</div>
                            <div className="text-xs text-gray-500">{p.uid}</div>
                        </div>
                    </div>
                ))}

                {players.length === 0 && (
                    <p className="text-gray-500">No players yet.</p>
                )}
            </div>
        </div>
    );
}
