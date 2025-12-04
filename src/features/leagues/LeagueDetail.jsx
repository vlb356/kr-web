// src/features/leagues/LeagueDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    db, doc, getDoc,
    joinLeague, leaveLeague,
    deleteLeague,
    getDocs, collection
} from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

export default function LeagueDetail() {

    const { id } = useParams();
    const { user } = useAuth();

    const [league, setLeague] = useState(null);
    const [loading, setLoading] = useState(true);
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        async function loadAll() {
            try {
                if (!id) return;

                // 1) Load league
                const ref = doc(db, "leagues", id);
                const snap = await getDoc(ref);

                if (!snap.exists()) {
                    setLeague(null);
                    setLoading(false);
                    return;
                }

                const data = { id: snap.id, ...snap.data() };
                setLeague(data);

                // 2) Load teams
                const tSnap = await getDocs(collection(db, "leagues", id, "teams"));
                setTeams(tSnap.docs.map(d => ({ id: d.id, ...d.data() })));

                // 3) Load matches 
                const mSnap = await getDocs(collection(db, "leagues", id, "matches"));
                setMatches(mSnap.docs.map(d => ({ id: d.id, ...d.data() })));

            } catch (err) {
                console.error("Error loading league:", err);
            } finally {
                setLoading(false);
            }
        }

        loadAll();
    }, [id]);


    // JOIN -------------------------
    async function handleJoin() {
        try {
            await joinLeague(id);
            setLeague(prev => ({
                ...prev,
                participants: [...(prev.participants || []), user.uid]
            }));
        } catch (err) {
            console.error(err);
            alert("Error joining league");
        }
    }

    // LEAVE ------------------------
    async function handleLeave() {
        try {
            await leaveLeague(id);
            setLeague(prev => ({
                ...prev,
                participants: prev.participants.filter(uid => uid !== user.uid)
            }));
        } catch (err) {
            console.error(err);
            alert("Error leaving league");
        }
    }

    // DELETE -----------------------
    async function handleDelete() {
        if (!user) return;
        if (user.uid !== league.ownerUid)
            return alert("You cannot delete this league.");

        if (!confirm("Are you sure?")) return;

        try {
            await deleteLeague(id, league.ownerUid);
            window.location.hash = "/leagues";
        } catch (err) {
            console.error(err);
            alert("Error deleting league");
        }
    }


    if (loading) {
        return <div className="text-center py-20 text-gray-500">Loading league...</div>;
    }

    if (!league) {
        return <div className="text-center py-20 text-red-600">League not found.</div>;
    }


    const isJoined = league.participants?.includes(user?.uid);

    return (
        <div className="max-w-4xl mx-auto px-6 py-10">

            {/* BACK */}
            <button
                onClick={() => window.history.back()}
                className="text-[#1662A6] font-medium mb-6"
            >
                ← Back
            </button>

            {/* HEADER */}
            <h1 className="text-4xl font-bold text-[#122944] mb-1">{league.title}</h1>
            <p className="text-gray-600 mb-6">{league.description}</p>

            {/* INFO BOX */}
            <div className="p-6 border rounded-2xl shadow-sm bg-white space-y-2 mb-6">
                <p><strong>Sport:</strong> {league.sport}</p>
                <p><strong>Format:</strong> {league.format}</p>
                <p><strong>Venue:</strong> {league.venue}</p>
                <p><strong>Visibility:</strong> {league.visibility}</p>
                <p><strong>Teams:</strong> {teams.length}</p>
                <p><strong>Owner:</strong> {league.ownerName}</p>
            </div>

            {/* JOIN / LEAVE */}
            {user && (
                <div className="mb-6">
                    {isJoined ? (
                        <button
                            onClick={handleLeave}
                            className="px-6 py-2 rounded-xl bg-gray-200 text-gray-800"
                        >
                            Leave League
                        </button>
                    ) : (
                        <button
                            onClick={handleJoin}
                            className="px-6 py-2 rounded-xl bg-[#1662A6] text-white"
                        >
                            Join League
                        </button>
                    )}
                </div>
            )}

            {/* TEAMS */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-3">Teams</h2>

                {teams.length === 0 ? (
                    <p className="text-gray-500">No teams yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {teams.map(t => (
                            <li key={t.id} className="p-3 border rounded-lg bg-white">
                                {t.name}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* MATCHES */}
            <section className="mb-10">
                <h2 className="text-2xl font-semibold mb-3">Matches</h2>

                {matches.length === 0 ? (
                    <p className="text-gray-500">No matches scheduled.</p>
                ) : (
                    <ul className="space-y-2">
                        {matches.map(m => (
                            <li key={m.id} className="p-3 border rounded-lg bg-white">
                                {m.teamA} vs {m.teamB} — {m.date}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* DELETE BUTTON */}
            {user?.uid === league.ownerUid && (
                <button
                    onClick={handleDelete}
                    className="mt-6 bg-red-600 text-white px-6 py-2 rounded-xl"
                >
                    Delete League
                </button>
            )}
        </div>
    );
}
