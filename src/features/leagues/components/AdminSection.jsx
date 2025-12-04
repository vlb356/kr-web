import React, { useState } from "react";
import { db, collection, getDocs, deleteDoc, doc } from "@/lib/firebase";
import { deleteLeague } from "@/lib/firebase";

export default function AdminSection({ league }) {
    const leagueId = league.id;

    const [loadingDeleteLeague, setLoadingDeleteLeague] = useState(false);
    const [loadingResetTeams, setLoadingResetTeams] = useState(false);
    const [loadingResetMatches, setLoadingResetMatches] = useState(false);

    // ----------------------------------------------------------------------
    // DELETE ALL TEAMS
    // ----------------------------------------------------------------------
    async function resetTeams() {
        if (!confirm("This will remove ALL teams. Continue?")) return;

        setLoadingResetTeams(true);

        const teamsRef = collection(db, "leagues", leagueId, "teams");
        const snap = await getDocs(teamsRef);

        const deletions = snap.docs.map((d) => deleteDoc(d.ref));
        await Promise.all(deletions);

        setLoadingResetTeams(false);
        alert("Teams removed successfully.");
    }

    // ----------------------------------------------------------------------
    // DELETE ALL MATCHES
    // ----------------------------------------------------------------------
    async function resetMatches() {
        if (!confirm("This will remove ALL matches. Continue?")) return;

        setLoadingResetMatches(true);

        const matchesRef = collection(db, "leagues", leagueId, "matches");
        const snap = await getDocs(matchesRef);

        const deletions = snap.docs.map((d) => deleteDoc(d.ref));
        await Promise.all(deletions);

        setLoadingResetMatches(false);
        alert("Matches removed successfully.");
    }

    // ----------------------------------------------------------------------
    // DELETE ENTIRE LEAGUE
    // ----------------------------------------------------------------------
    async function handleDeleteLeague() {
        if (!confirm("⚠ Are you sure you want to permanently delete this league?")) return;

        setLoadingDeleteLeague(true);

        try {
            await deleteLeague(leagueId, league.ownerUid);
            alert("League deleted.");
            window.location.hash = "#/leagues";
        } catch (err) {
            console.error(err);
            alert("Error: " + err.message);
        }

        setLoadingDeleteLeague(false);
    }

    return (
        <div className="space-y-6">

            <h2 className="text-2xl font-bold text-red-600">Admin Panel</h2>

            <p className="text-gray-600">
                These tools are only available to the league owner. Handle with care.
            </p>

            {/* RESET TEAMS */}
            <div className="border p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Teams</h3>
                <p className="text-gray-500 mb-4">
                    This will delete all teams created in this league.
                </p>

                <button
                    onClick={resetTeams}
                    disabled={loadingResetTeams}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                    {loadingResetTeams ? "Removing..." : "Remove All Teams"}
                </button>
            </div>

            {/* RESET MATCHES */}
            <div className="border p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">Matches</h3>
                <p className="text-gray-500 mb-4">
                    This will delete every match (confirmed or not).
                </p>

                <button
                    onClick={resetMatches}
                    disabled={loadingResetMatches}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                    {loadingResetMatches ? "Removing..." : "Remove All Matches"}
                </button>
            </div>

            {/* DELETE LEAGUE */}
            <div className="border p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2 text-red-600">Delete League</h3>
                <p className="text-gray-500 mb-4">
                    This action is irreversible. All data will be lost.
                </p>

                <button
                    onClick={handleDeleteLeague}
                    disabled={loadingDeleteLeague}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                    {loadingDeleteLeague ? "Deleting..." : "Delete League"}
                </button>
            </div>
        </div>
    );
}
