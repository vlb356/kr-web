// src/features/leagues/components/TeamsSection.jsx
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link, useParams } from "react-router-dom";

export default function TeamsSection({ league }) {
    const { leagueId } = useParams();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!leagueId) return;
        loadTeams();
    }, [leagueId]);

    async function loadTeams() {
        try {
            const ref = collection(db, "leagues", leagueId, "teams");
            const snap = await getDocs(ref);

            const list = snap.docs.map(doc => ({
                id: doc.id,      // ← IMPORTANTE: usar id
                ...doc.data(),
            }));

            setTeams(list);
        } catch (err) {
            console.error("Error loading teams:", err);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="p-4">Loading teams...</div>;
    if (!teams.length) return <div className="p-4">No teams available.</div>;

    return (
        <div className="p-4 space-y-3">
            {teams.map(team => (
                <Link
                    key={team.id}    // ← IMPORTANTE
                    to={`/league/${leagueId}/team/${team.id}`}
                    className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                >
                    <div className="font-semibold text-lg">{team.name}</div>
                    <div className="text-gray-500 text-sm">
                        Members: {team.members?.length || 0}
                    </div>
                </Link>
            ))}
        </div>
    );
}
