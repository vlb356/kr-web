import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, joinTeam, leaveTeam } from "@/lib/firebase";
import TeamLogo from "./TeamLogo";

export default function TeamsSection() {
    const { leagueId, user } = useOutletContext();
    const navigate = useNavigate();

    const [teams, setTeams] = useState([]);

    useEffect(() => {
        loadTeams();
    }, [leagueId]);

    async function loadTeams() {
        const ref = collection(db, "leagues", leagueId, "teams");
        const snap = await getDocs(ref);

        const arr = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setTeams(arr);
    }

    async function handleJoin(teamId) {
        await joinTeam(leagueId, teamId, user.uid);
        await loadTeams();
    }

    async function handleLeave(teamId) {
        await leaveTeam(leagueId, teamId, user.uid);
        await loadTeams();
    }

    return (
        <div className="mt-6 space-y-3">
            {teams.map(team => {
                const isMember = team.members?.includes(user.uid);

                return (
                    <div
                        key={team.id}
                        className="p-4 border rounded-lg flex items-center justify-between"
                    >
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => navigate(`/league/${leagueId}/team/${team.id}`)}
                        >
                            <TeamLogo initials={team.initials} color={team.color} />
                            <div>
                                <div className="font-semibold">{team.name}</div>
                                <div className="text-sm text-gray-600">
                                    {team.members?.length || 0}/{team.maxPlayers || 10} players
                                </div>
                            </div>
                        </div>

                        <div>
                            {isMember ? (
                                <button
                                    className="px-3 py-1 bg-red-500 text-white rounded"
                                    onClick={() => handleLeave(team.id)}
                                >
                                    Leave
                                </button>
                            ) : (
                                <button
                                    className="px-3 py-1 bg-blue-600 text-white rounded"
                                    onClick={() => handleJoin(team.id)}
                                >
                                    Join
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
