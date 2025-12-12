import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    collection,
    getDocs,
    doc,
    writeBatch,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

import AddMatchModal from "./AddMatchModal";
import ProposeScoreModal from "./ProposeScoreModal";
import ForceScoreModal from "./ForceScoreModal";

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
    const [activeRound, setActiveRound] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showAddMatch, setShowAddMatch] = useState(false);
    const [proposeMatch, setProposeMatch] = useState(null);
    const [forceMatch, setForceMatch] = useState(null);

    const isOwner = user && league && user.uid === league.ownerUid;

    /* --------------------------------
       LOAD DATA
    --------------------------------- */
    async function loadAll() {
        setLoading(true);

        const leagueSnap = await getDocs(collection(db, "leagues"));
        const found = leagueSnap.docs.find((d) => d.id === leagueId);
        setLeague(found ? { id: found.id, ...found.data() } : null);

        const tSnap = await getDocs(collection(db, "leagues", leagueId, "teams"));
        const teamList = tSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setTeams(teamList);

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
       HELPERS
    --------------------------------- */
    const teamsById = useMemo(() => {
        const map = {};
        teams.forEach((t) => (map[t.id] = t));
        return map;
    }, [teams]);

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

    async function deleteMatch(matchId) {
        if (!isOwner) return;
        if (!confirm("Delete this match?")) return;

        await deleteDoc(doc(db, "leagues", leagueId, "matches", matchId));
        await loadAll();
    }

    if (loading) return <div>Loading matches…</div>;

    return (
        <div className="space-y-6">

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

            {/* ROUNDS */}
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

            {/* MATCHES */}
            <div className="space-y-4">
                {(rounds[activeRound] || []).map((m) => {
                    const homeTeam = teamsById[m.homeTeamId];
                    const awayTeam = teamsById[m.awayTeamId];

                    const isCaptain =
                        user &&
                        (user.uid === homeTeam?.captainUid ||
                            user.uid === awayTeam?.captainUid);

                    const played = m.homeScore != null && m.awayScore != null;

                    return (
                        <div
                            key={m.id}
                            className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition ${played ? "border-green-300" : "border-gray-200"
                                }`}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">

                                {/* HOME */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center"
                                        style={{ backgroundColor: m.homeColor }}
                                    >
                                        {m.homeInitials}
                                    </div>
                                    <span className="font-semibold text-[#122944]">
                                        {m.homeTeamName}
                                    </span>
                                </div>

                                {/* CENTER (RESULT / VS) */}
                                <div className="text-center">
                                    {played ? (
                                        <>
                                            <div className="text-green-600 font-extrabold text-2xl">
                                                {m.homeScore} - {m.awayScore}
                                            </div>
                                            <div className="text-xs text-green-500 font-semibold mt-1">
                                                Final
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-[#E96F19] font-extrabold text-lg">
                                                VS
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                Jornada {m.round}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* AWAY */}
                                <div className="flex items-center gap-3 justify-end">
                                    <span className="font-semibold text-[#122944]">
                                        {m.awayTeamName}
                                    </span>
                                    <div
                                        className="w-11 h-11 rounded-full text-white font-bold flex items-center justify-center"
                                        style={{ backgroundColor: m.awayColor }}
                                    >
                                        {m.awayInitials}
                                    </div>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            {(isOwner || isCaptain) && (
                                <div className="flex gap-3 justify-end mt-4 text-sm">
                                    {isCaptain && !played && (
                                        <button
                                            onClick={() => setProposeMatch(m)}
                                            className="text-[#1662A6] font-semibold hover:underline"
                                        >
                                            Propose score
                                        </button>
                                    )}

                                    {isOwner && (
                                        <>
                                            <button
                                                onClick={() => setForceMatch(m)}
                                                className="text-red-600 font-semibold hover:underline"
                                            >
                                                Force result
                                            </button>

                                            <button
                                                onClick={() => deleteMatch(m.id)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* MODALS */}
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

            {proposeMatch && (
                <ProposeScoreModal
                    leagueId={leagueId}
                    match={proposeMatch}
                    onClose={() => {
                        setProposeMatch(null);
                        loadAll();
                    }}
                />
            )}

            {forceMatch && (
                <ForceScoreModal
                    leagueId={leagueId}
                    match={forceMatch}
                    onClose={() => {
                        setForceMatch(null);
                        loadAll();
                    }}
                />
            )}
        </div>
    );
}
