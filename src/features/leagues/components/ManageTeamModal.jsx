import React, { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
} from "firebase/firestore";

import { db, joinTeam, leaveTeam } from "@/lib/firebase";
import ManageTeamModal from "./ManageTeamModal";

export default function TeamsSection({ leagueId, league, user }) {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        const ref = collection(db, "leagues", leagueId, "teams");
        const unsub = onSnapshot(ref, (snap) => {
            setTeams(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });
        return () => unsub();
    }, [leagueId]);

    const myUid = user?.uid;
    const currentTeam = teams.find((t) => t.members?.includes(myUid));

    async function handleJoin(team) {
        try {
            await joinTeam(leagueId, team.id, myUid);
        } catch (err) {
            alert(err.message);
        }
    }

    async function handleLeave(team) {
        try {
            await leaveTeam(leagueId, team.id, myUid);
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <div className="space-y-4">

            {teams.map((team) => {
                const isMember = team.members?.includes(myUid);
                const isFull = (team.members?.length || 0) >= team.maxPlayers;

                return (
                    <div
                        key={team.id}
                        className="p-4 bg-white shadow rounded-lg flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <TeamLogo initials={team.initials} color={team.color} />
                            <div>
                                <div className="font-semibold">{team.name}</div>
                                <div className="text-xs text-gray-500">
                                    {team.members?.length}/{team.maxPlayers} players
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">

                            {/* Owner / Captain can edit */}
                            {(user?.uid === league.ownerUid ||
                                user?.uid === team.captainUid) && (
                                    <button
                                        onClick={() => setSelectedTeam(team)}
                                        className="kr-btn-secondary"
                                    >
                                        Manage
                                    </button>
                                )}

                            {/* Join / Leave */}
                            {!isMember && !isFull && (
                                <button
                                    onClick={() => handleJoin(team)}
                                    className="kr-btn"
                                >
                                    Join
                                </button>
                            )}

                            {isFull && !isMember && (
                                <div className="text-xs text-red-500 font-semibold">
                                    FULL
                                </div>
                            )}

                            {isMember && (
                                <button
                                    onClick={() => handleLeave(team)}
                                    className="kr-btn-danger"
                                >
                                    Leave
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}

            {selectedTeam && (
                <ManageTeamModal
                    leagueId={leagueId}
                    team={selectedTeam}
                    onClose={() => setSelectedTeam(null)}
                    league={league}
                />
            )}
        </div>
    );
}
