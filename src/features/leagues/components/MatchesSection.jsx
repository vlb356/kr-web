import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    getDocs,
    doc,
    writeBatch,
    serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import AddMatchModal from "./AddMatchModal";

function makeId() {
    return crypto.randomUUID();
}

/* --------------------------------
   ROUND ROBIN (circle method)
--------------------------------- */
function generateRoundRobin(teamIds) {
    const teams = [...teamIds];
    if (teams.length % 2 === 1) teams.push("BYE");

    const n = teams.length;
    const rounds = n - 1;
    const half = n / 2;
    const arr = [...teams];
    const schedule = [];

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
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddMatch, setShowAddMatch] = useState(false);
    const [activeRound, setActiveRound] = useState(null);

    const isOwner = user && league && league.ownerUid === user.uid;

    /* --------------------------------
       LOAD DATA
    --------------------------------- */
    async function loadAll() {
        setLoading(true);

        const leagueSnap = await getDocs(collection(db, "leagues"));
        const found = leagueSnap.docs.find((d) => d.id === leagueId);
        setLeague(found ? { id: found.id, ...found.data() } : null);

        const tSnap = await getDocs(collection(db, "leagues", leagueId, "teams"));
        setTeams(tSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        const mSnap = await getDocs(collection(db, "leagues", leagueId, "matches"));
        const m = mSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        m.sort((a, b) => (a.round || 0) - (b.round || 0));
        setMatches(m);

        if (m.length > 0) {
            setActiveRound(Math.min(...m.map((x) => x.round || 1)));
        }

        setLoading(false);
    }

    useEffect(() => {
        loadAll();
    }, [leagueId]);

    /* --------------------------------
       GROUP BY ROUND
    --------------------------------- */
    const rounds = useMemo(() => {
        const map = {};
        matches.forEach((m) => {
            const r = m.round || 1;
            if (!map[r]) map[r] = [];
            map[r].push(m);
        });
        return map;
    }, [matches]);

    const roundNumbers = Object.keys(rounds)
        .map(Number)
        .sort((a, b) => a - b);

    /* --------------------------------
       GENERATE MATCHES
    --------------------------------- */
    async function handleGenerateMatches({ force } = { force: false }) {
        if (!isOwner) return alert("Only the league owner can do this.");

        const matchesRef = collection(db, "leagues", leagueId, "matches");
        const existing = await getDocs(matchesRef);

        if (!force && !existing.empty) {
            return alert("Matches already exist.");
        }

        if (force && !existing.empty) {
            const batch = writeBatch(db);
            existing.docs.forEach((d) => batch.delete(d.ref));
            await batch.commit();
        }

        const tSnap = await getDocs(collection(db, "leagues", leagueId, "teams"));
        const teamList = tSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        if (teamList.length < 2) return alert("At least 2 teams required.");

        const schedule = generateRoundRobin(teamList.map((t) => t.id));
        const batch = writeBatch(db);

        schedule.forEach(({ round, pairs }) => {
            pairs.forEach(([homeId, awayId]) => {
                const home = teamList.find((t) => t.id === homeId);
                const away = teamList.find((t) => t.id === awayId);

                batch.set(doc(db, "leagues", leagueId, "matches", makeId()), {
                    round,
                    homeTeamId: homeId,
                    awayTeamId: awayId,
                    homeTeamName: home?.name,
                    homeInitials: home?.initials,
                    homeColor: home?.color,
                    awayTeamName: away?.name,
                    awayInitials: away?.initials,
                    awayColor: away?.color,
                    homeScore: null,
                    awayScore: null,
                    status: "scheduled",
                    createdAt: serverTimestamp(),
                });
            });
        });

        await batch.commit();
        await loadAll();
    }

    if (loading) return <div>Loading matches…</div>;

    return (
        <div className="space-y-6">

            {/* ADMIN BAR */}
            {isOwner && (
                <div className="bg-[#122944] text-white p-5 rounded-xl flex justify-between">
                    <div>
                        <div className="font-semibold">Admin: Matches</div>
                        <div className="text-sm opacity-80">
                            Generate round-robin schedule
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            className="bg-[#E96F19] px-4 py-2 rounded-lg font-semibold"
                            onClick={() => handleGenerateMatches({ force: false })}
                        >
                            Generate
                        </button>
                        <button
                            className="bg-white/10 px-4 py-2 rounded-lg"
                            onClick={() => handleGenerateMatches({ force: true })}
                        >
                            Regenerate
                        </button>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#122944]">Matches</h2>
                {isOwner && (
                    <button
                        onClick={() => setShowAddMatch(true)}
                        className="bg-[#1662A6] text-white px-4 py-2 rounded-lg"
                    >
                        + Create Match
                    </button>
                )}
            </div>

            {/* ROUND TABS */}
            <div className="flex gap-2 flex-wrap">
                {roundNumbers.map((r) => (
                    <button
                        key={r}
                        onClick={() => setActiveRound(r)}
                        className={`px-4 py-2 rounded-lg font-semibold transition ${activeRound === r
                                ? "bg-[#1662A6] text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        Jornada {r}
                    </button>
                ))}
            </div>

            {/* MATCH LIST */}
            <div className="space-y-4">
                {(rounds[activeRound] || []).map((m) => {
                    const played = m.homeScore != null && m.awayScore != null;
                    const statusColor = played
                        ? "border-green-300"
                        : m.status === "pending"
                            ? "border-orange-300"
                            : "border-gray-200";

                    return (
                        <div
                            key={m.id}
                            className={`bg-white border ${statusColor} rounded-xl p-4 shadow-sm hover:shadow-md transition`}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">

                                {/* HOME */}
                                <div className="flex items-center gap-3 justify-start">
                                    <div
                                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: m.homeColor }}
                                    >
                                        {m.homeInitials}
                                    </div>
                                    <span className="font-semibold text-[#122944]">
                                        {m.homeTeamName}
                                    </span>
                                </div>

                                {/* CENTER */}
                                <div className="text-center">
                                    <div className="text-[#E96F19] font-extrabold text-lg">
                                        {played ? `${m.homeScore} - ${m.awayScore}` : "VS"}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Jornada {m.round}
                                    </div>
                                </div>

                                {/* AWAY */}
                                <div className="flex items-center gap-3 justify-end">
                                    <span className="font-semibold text-[#122944]">
                                        {m.awayTeamName}
                                    </span>
                                    <div
                                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: m.awayColor }}
                                    >
                                        {m.awayInitials}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showAddMatch && (
                <AddMatchModal
                    leagueId={leagueId}
                    teams={teams}
                    onClose={() => {
                        setShowAddMatch(false);
                        loadAll();
                    }}
                />
            )}
        </div>
    );
}
