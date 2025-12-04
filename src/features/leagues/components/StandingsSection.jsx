import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function StandingsSection({ leagueId }) {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        loadTeams();
    }, []);

    async function loadTeams() {
        const ref = collection(db, "leagues", leagueId, "teams");
        const snap = await getDocs(ref);

        const arr = snap.docs.map((d) => ({
            id: d.id,
            name: d.data().name,
            played: d.data().played || 0,
            wins: d.data().wins || 0,
            losses: d.data().losses || 0,
            points: d.data().points || 0,
        }));

        // Order standings by points
        arr.sort((a, b) => b.points - a.points);

        setTeams(arr);
    }

    return (
        <div>
            {teams.length === 0 ? (
                <div className="text-gray-500">No teams available.</div>
            ) : (
                <table className="w-full border-collapse bg-white shadow rounded-xl">
                    <thead>
                        <tr className="bg-[#122944] text-white">
                            <th className="p-3">Team</th>
                            <th className="p-3">Played</th>
                            <th className="p-3">Wins</th>
                            <th className="p-3">Losses</th>
                            <th className="p-3">Points</th>
                        </tr>
                    </thead>

                    <tbody>
                        {teams.map((t) => (
                            <tr key={t.id} className="text-center border-t">
                                <td className="p-3 font-semibold text-[#1662A6]">{t.name}</td>
                                <td className="p-3">{t.played}</td>
                                <td className="p-3">{t.wins}</td>
                                <td className="p-3">{t.losses}</td>
                                <td className="p-3 font-bold">{t.points}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
