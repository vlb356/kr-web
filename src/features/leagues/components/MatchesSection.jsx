import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    getDocs,
    doc,
    setDoc,
    writeBatch,
    serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

// Si ya tienes estos componentes, déjalos.
// Si no existen, puedes borrar estas líneas y el bloque del modal.
import AddMatchModal from "./AddMatchModal";

function makeId() {
    return crypto.randomUUID();
}

/**
 * Round-robin (circle method)
 * - Genera jornadas donde todos juegan contra todos 1 vez.
 * - Si número impar, añade "BYE".
 */
function generateRoundRobin(teamIds) {
    const teams = [...teamIds];
    const hasBye = teams.length % 2 === 1;
    if (hasBye) teams.push("BYE");

    const n = teams.length;
    const rounds = n - 1;
    const half = n / 2;

    // Array que rotamos (dejando fijo el primero)
    const arr = [...teams];

    const schedule = []; // [{ round: 1, pairs: [[a,b],[c,d]] }...]

    for (let r = 0; r < rounds; r++) {
        const pairs = [];

        for (let i = 0; i < half; i++) {
            const home = arr[i];
            const away = arr[n - 1 - i];

            if (home !== "BYE" && away !== "BYE") {
                pairs.push([home, away]);
            }
        }

        schedule.push({ round: r + 1, pairs });

        // Rotación: [fixed, last, ...middle]
        const fixed = arr[0];
        const rest = arr.slice(1);
        rest.unshift(rest.pop());
        arr.splice(0, arr.length, fixed, ...rest);
    }

    return schedule;
}

export default function MatchesSection() {
    const { leagueId } = useParams();

    const user = auth.currentUser;

    const [league, setLeague] = useState(null);

    const [teams, setTeams] = useState([]); // [{id,name,initials,color,description...}]
    const teamsById = useMemo(() => {
        const map = new Map();
        teams.forEach((t) => map.set(t.id, t));
        return map;
    }, [teams]);

    const [matches, setMatches] = useState([]); // [{id, homeTeamId, awayTeamId, round, ...}]
    const [loading, setLoading] = useState(true);

    const [showAddMatch, setShowAddMatch] = useState(false);

    const isOwner = !!(user && league && league.ownerUid === user.uid);

    async function loadAll() {
        if (!leagueId) return;
        setLoading(true);

        // league doc
        const leagueSnap = await getDocs(collection(db, "leagues"));
        // Nota: no iteramos todo; pero por simplicidad sin getDoc importado aquí:
        // Mejor: usa getDoc, pero mantengo simple y estable con tu setup mínimo.
        // Si prefieres, te lo ajusto con getDoc.
        const found = leagueSnap.docs.find((d) => d.id === leagueId);
        setLeague(found ? { id: found.id, ...found.data() } : { id: leagueId });

        // teams
        const tSnap = await getDocs(collection(db, "leagues", leagueId, "teams"));
        const t = tSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTeams(t);

        // matches
        const mSnap = await getDocs(collection(db, "leagues", leagueId, "matches"));
        const m = mSnap.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .sort((a, b) => (a.round || 0) - (b.round || 0));
        setMatches(m);

        setLoading(false);
    }

    useEffect(() => {
        loadAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [leagueId]);

    async function deleteAllMatches() {
        const mSnap = await getDocs(collection(db, "leagues", leagueId, "matches"));
        if (mSnap.empty) return;

        const batch = writeBatch(db);
        mSnap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
    }

    async function handleGenerateMatches({ force } = { force: false }) {
        if (!leagueId) return;

        if (!isOwner) {
            alert("Only the league owner can generate matches.");
            return;
        }

        // Reload counts to avoid stale state
        const currentMatchesSnap = await getDocs(
            collection(db, "leagues", leagueId, "matches")
        );

        if (!force && !currentMatchesSnap.empty) {
            alert(
                "Matches already exist. Use 'Regenerate' if you want to recreate them."
            );
            return;
        }

        const tSnap = await getDocs(collection(db, "leagues", leagueId, "teams"));
        const teamList = tSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

        if (teamList.length < 2) {
            alert("You need at least 2 teams to generate matches.");
            return;
        }

        if (force && !currentMatchesSnap.empty) {
            await deleteAllMatches();
        }

        const schedule = generateRoundRobin(teamList.map((t) => t.id));

        const batch = writeBatch(db);

        schedule.forEach(({ round, pairs }) => {
            pairs.forEach(([homeTeamId, awayTeamId]) => {
                const home = teamList.find((t) => t.id === homeTeamId);
                const away = teamList.find((t) => t.id === awayTeamId);

                const id = makeId();

                batch.set(doc(db, "leagues", leagueId, "matches", id), {
                    round,
                    homeTeamId,
                    awayTeamId,

                    // Denormalizamos un mínimo para que se renderice bonito incluso si luego cambian nombres
                    homeTeamName: home?.name || "Home",
                    homeInitials: home?.initials || "",
                    homeColor: home?.color || "#1662A6",

                    awayTeamName: away?.name || "Away",
                    awayInitials: away?.initials || "",
                    awayColor: away?.color || "#1662A6",

                    homeScore: null,
                    awayScore: null,
                    status: "scheduled",
                    createdAt: serverTimestamp(),
                });
            });
        });

        await batch.commit();
        await loadAll();
        alert("Matches generated successfully.");
    }

    if (loading) {
        return <div className="text-gray-600">Loading matches…</div>;
    }

    return (
        <div className="space-y-6">
            {/* OWNER ADMIN BOX */}
            {isOwner && (
                <div className="bg-[#122944] text-white rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="text-lg font-semibold">Admin: Matches</div>
                        <div className="text-sm opacity-90">
                            Generate a full round-robin schedule (all teams play each other).
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            className="px-4 py-2 rounded-lg font-semibold bg-[#E96F19] hover:bg-[#cf5f15]"
                            onClick={() => handleGenerateMatches({ force: false })}
                        >
                            Generate
                        </button>

                        <button
                            className="px-4 py-2 rounded-lg font-semibold bg-white/10 hover:bg-white/20"
                            onClick={() => handleGenerateMatches({ force: true })}
                        >
                            Regenerate
                        </button>
                    </div>
                </div>
            )}

            {/* CREATE MATCH (manual) */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#122944]">Matches</h2>
                <button
                    className="px-4 py-2 rounded-lg bg-[#1662A6] text-white font-semibold hover:bg-[#0f4f86]"
                    onClick={() => setShowAddMatch(true)}
                >
                    + Create Match
                </button>
            </div>

            {matches.length === 0 ? (
                <div className="bg-white border rounded-xl p-6 text-gray-600">
                    No matches yet.
                </div>
            ) : (
                <div className="space-y-3">
                    {matches.map((m) => {
                        const home =
                            teamsById.get(m.homeTeamId) || {
                                name: m.homeTeamName,
                                initials: m.homeInitials,
                                color: m.homeColor,
                            };
                        const away =
                            teamsById.get(m.awayTeamId) || {
                                name: m.awayTeamName,
                                initials: m.awayInitials,
                                color: m.awayColor,
                            };

                        const scoreText =
                            m.homeScore == null || m.awayScore == null
                                ? "No score"
                                : `${m.homeScore} - ${m.awayScore}`;

                        return (
                            <div
                                key={m.id}
                                className="bg-white border rounded-xl p-4 flex items-center justify-between shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    {/* HOME */}
                                    <div className="flex items-center gap-3 min-w-[220px]">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: home?.color || "#1662A6" }}
                                        >
                                            {(home?.initials || "?").slice(0, 3)}
                                        </div>
                                        <div className="font-semibold text-[#122944]">
                                            {home?.name || "Home"}
                                        </div>
                                    </div>

                                    {/* VS + ROUND */}
                                    <div className="text-center min-w-[140px]">
                                        <div className="text-[#E96F19] font-extrabold">VS</div>
                                        <div className="text-xs text-gray-500">Round {m.round}</div>
                                        <div className="text-sm text-gray-700">{scoreText}</div>
                                    </div>

                                    {/* AWAY */}
                                    <div className="flex items-center gap-3 min-w-[220px]">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                                            style={{ backgroundColor: away?.color || "#1662A6" }}
                                        >
                                            {(away?.initials || "?").slice(0, 3)}
                                        </div>
                                        <div className="font-semibold text-[#122944]">
                                            {away?.name || "Away"}
                                        </div>
                                    </div>
                                </div>

                                {/* ACTIONS (si tú ya tienes Edit/Delete, aquí los puedes reenganchar) */}
                                <div className="flex gap-2">
                                    <button className="px-3 py-1.5 rounded-md bg-[#1662A6] text-white font-semibold">
                                        Edit
                                    </button>
                                    <button className="px-3 py-1.5 rounded-md bg-red-500 text-white font-semibold">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {showAddMatch && (
                <AddMatchModal
                    leagueId={leagueId}
                    onClose={() => setShowAddMatch(false)}
                    onCreated={() => loadAll()}
                />
            )}
        </div>
    );
}
