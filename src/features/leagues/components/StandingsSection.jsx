// src/features/leagues/components/StandingsSection.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StandingsSection({ leagueId }) {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTeams() {
            try {
                const ref = collection(db, "leagues", leagueId, "teams");
                const snap = await getDocs(ref);

                const arr = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    wins: doc.data().wins || 0,
                    losses: doc.data().losses || 0,
                    draws: doc.data().draws || 0
                }));

                // Ordenar standings clásico
                arr.sort((a, b) => b.wins - a.wins);

                setTeams(arr);
            } catch (err) {
                console.error("Error loading standings:", err);
            } finally {
                setLoading(false);
            }
        }

        loadTeams();
    }, [leagueId]);

    if (loading) return <div>Loading...</div>;

    if (teams.length === 0)
        return <div>No teams available.</div>;

    return (
        <table className="min-w-full border mt-4">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border">Team</th>
                    <th className="p-2 border">W</th>
                    <th className="p-2 border">D</th>
                    <th className="p-2 border">L</th>
                </tr>
            </thead>

            <tbody>
                {teams.map((t) => (
                    <tr key={t.id} className="text-center">
                        <td className="border p-2">{t.name}</td>
                        <td className="border p-2">{t.wins}</td>
                        <td className="border p-2">{t.draws}</td>
                        <td className="border p-2">{t.losses}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
