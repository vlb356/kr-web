import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function TeamDetail() {
    const { leagueId, teamId } = useParams();

    const [team, setTeam] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadTeam() {
            const ref = doc(db, "leagues", leagueId, "teams", teamId);
            const snap = await getDoc(ref);

            if (!snap.exists()) {
                setLoading(false);
                return;
            }

            const teamData = snap.data();
            setTeam(teamData);

            // ---- Load players from users/{uid} ----
            const finalPlayers = [];

            for (const uid of teamData.members || []) {
                const userRef = doc(db, "users", uid);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();

                    finalPlayers.push({
                        uid,
                        name: data.name || "Unknown user",
                        avatarUrl: data.avatarUrl || null,
                        email: data.email,
                    });
                } else {
                    finalPlayers.push({
                        uid,
                        name: "Unknown user",
                        avatarUrl: null,
                    });
                }
            }

            setPlayers(finalPlayers);
            setLoading(false);
        }

        loadTeam();
    }, [leagueId, teamId]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (!team) return <p className="p-6 text-red-500">Team not found.</p>;

    return (
        <div className="max-w-4xl mx-auto p-6">

            {/* BACK BUTTON */}
            <Link
                to={`/league/${leagueId}/teams`}
                className="text-blue-600 hover:underline block mb-6"
            >
                ← Back to teams
            </Link>

            {/* TEAM HEADER */}
            <div className="flex items-center gap-4 mb-6">
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: team.color }}
                >
                    {team.initials}
                </div>

                <div>
                    <h1 className="text-3xl font-semibold">{team.name}</h1>
                    <p className="text-gray-600">{team.description || "No description"}</p>
                </div>
            </div>

            {/* INFO CARD */}
            <div className="bg-white rounded-lg shadow p-4 mb-8">
                <p className="text-lg font-semibold">
                    Players: {players.length} / {team.maxPlayers}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Created on: {new Date(team.createdAt?.toDate?.() || Date.now()).toLocaleString()}
                </p>
            </div>

            {/* PLAYERS LIST */}
            <h2 className="text-xl font-semibold mb-4">Players</h2>

            {players.length === 0 && (
                <p className="text-gray-500">No players yet.</p>
            )}

            <div className="space-y-3">
                {players.map(user => (
                    <div
                        key={user.uid}
                        className="flex items-center gap-4 bg-gray-100 p-3 rounded-lg"
                    >
                        {/* Avatar */}
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                className="w-10 h-10 rounded-full object-cover"
                                alt="profile"
                            />
                        ) : (
                            <div className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold">
                                {user.name?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                        )}

                        {/* Name */}
                        <div className="font-medium">{user.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
