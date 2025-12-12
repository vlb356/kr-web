import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function StandingsSection() {
    const { leagueId } = useParams();

    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    /* --------------------------------
       LOAD DATA
    --------------------------------- */
    useEffect(() => {
        async function load() {
            setLoading(true);

            const teamsSnap = await getDocs(
                collection(db, "leagues", leagueId, "teams")
            );
            const teamsData = teamsSnap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));

            const matchesSnap = await getDocs(
                collection(db, "leagues", leagueId, "matches")
            );
            const matchesData = matchesSnap.docs.map((d) => ({
                id: d.id,
                ...d.data(),
            }));

            setTeams(teamsData);
            setMatches(matchesData);
            setLoading(false);
        }

        load();
    }, [leagueId]);

    /* --------------------------------
       CALCULATE STANDINGS
    --------------------------------- */
    const standings = useMemo(() => {
        const table = {};

        // Inicializar equipos
        teams.forEach((t) => {
            table[t.id] = {
                teamId: t.id,
                name: t.name,
                initials: t.initials,
                color: t.color,
                played: 0,
                wins: 0,
                draws: 0,
                losses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                goalDiff: 0,
                points: 0,
            };
        });

        // Procesar partidos FINALIZADOS
        matches.forEach((m) => {
            if (m.homeScore == null || m.awayScore == null) return;

            const home = table[m.homeTeamId];
            const away = table[m.awayTeamId];
            if (!home || !away) return;

            home.played += 1;
            away.played += 1;

            home.goalsFor += m.homeScore;
            home.goalsAgainst += m.awayScore;

            away.goalsFor += m.awayScore;
            away.goalsAgainst += m.homeScore;

            if (m.homeScore > m.awayScore) {
                home.wins += 1;
                home.points += 3;
                away.losses += 1;
            } else if (m.homeScore < m.awayScore) {
                away.wins += 1;
                away.points += 3;
                home.losses += 1;
            } else {
                home.draws += 1;
                away.draws += 1;
                home.points += 1;
                away.points += 1;
            }
        });

        // Goal difference
        Object.values(table).forEach((t) => {
            t.goalDiff = t.goalsFor - t.goalsAgainst;
        });

        // Ordenar
        return Object.values(table).sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            if (b.goalDiff !== a.goalDiff) return b.goalDiff - a.goalDiff;
            if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
            return a.name.localeCompare(b.name);
        });
    }, [teams, matches]);

    if (loading) return <div>Loading standings…</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#122944]">Standings</h2>

            <div className="overflow-x-auto bg-white rounded-xl border">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-4 py-3 text-left">#</th>
                            <th className="px-4 py-3 text-left">Team</th>
                            <th className="px-3 py-3 text-center">P</th>
                            <th className="px-3 py-3 text-center">W</th>
                            <th className="px-3 py-3 text-center">D</th>
                            <th className="px-3 py-3 text-center">L</th>
                            <th className="px-3 py-3 text-center">GF</th>
                            <th className="px-3 py-3 text-center">GA</th>
                            <th className="px-3 py-3 text-center">GD</th>
                            <th className="px-3 py-3 text-center font-bold">Pts</th>
                        </tr>
                    </thead>

                    <tbody>
                        {standings.map((t, index) => (
                            <tr
                                key={t.teamId}
                                className="border-t hover:bg-gray-50 transition"
                            >
                                <td className="px-4 py-3 font-semibold">{index + 1}</td>

                                <td className="px-4 py-3 flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full text-white flex items-center justify-center font-bold"
                                        style={{ backgroundColor: t.color }}
                                    >
                                        {t.initials}
                                    </div>
                                    {t.name}
                                </td>

                                <td className="px-3 py-3 text-center">{t.played}</td>
                                <td className="px-3 py-3 text-center">{t.wins}</td>
                                <td className="px-3 py-3 text-center">{t.draws}</td>
                                <td className="px-3 py-3 text-center">{t.losses}</td>
                                <td className="px-3 py-3 text-center">{t.goalsFor}</td>
                                <td className="px-3 py-3 text-center">{t.goalsAgainst}</td>
                                <td className="px-3 py-3 text-center">{t.goalDiff}</td>
                                <td className="px-3 py-3 text-center font-bold">
                                    {t.points}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
