// src/features/leagues/components/AdminSection.jsx
import { useState } from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    addDoc,
    doc,
    serverTimestamp,
} from "firebase/firestore";
import { db, deleteLeague } from "@/lib/firebase";

export default function AdminSection({ league }) {
    const leagueId = league.id;

    const [loadingResetTeams, setLoadingResetTeams] = useState(false);
    const [loadingResetMatches, setLoadingResetMatches] = useState(false);
    const [loadingAutoMatches, setLoadingAutoMatches] = useState(false);
    const [loadingDeleteLeague, setLoadingDeleteLeague] = useState(false);

    // ---------------------------------------------------
    // RESET TEAMS
    // ---------------------------------------------------
    async function resetTeams() {
        if (!confirm("This will remove ALL teams. Continue?")) return;

        setLoadingResetTeams(true);

        const teamsRef = collection(db, "leagues", leagueId, "teams");
        const snap = await getDocs(teamsRef);

        await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));

        setLoadingResetTeams(false);
        alert("All teams removed.");
    }

    // ---------------------------------------------------
    // RESET MATCHES
    // ---------------------------------------------------
    async function resetMatches() {
        if (!confirm("This will remove ALL matches. Continue?")) return;

        setLoadingResetMatches(true);

        const matchesRef = collection(db, "leagues", leagueId, "matches");
        const snap = await getDocs(matchesRef);

        await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));

        setLoadingResetMatches(false);
        alert("All matches removed.");
    }

    // ---------------------------------------------------
    // AUTO GENERATE MATCHES (ROUND ROBIN – ONE LEG)
    // ---------------------------------------------------
    async function generateAutoMatches() {
        setLoadingAutoMatches(true);

        const teamsSnap = await getDocs(
            collection(db, "leagues", leagueId, "teams")
        );

        const teams = teamsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
        }));

        if (teams.length < 2) {
            alert("At least 2 teams are required.");
            setLoadingAutoMatches(false);
            return;
        }

        const matchesRef = collection(db, "leagues", leagueId, "matches");
        const existingMatches = await getDocs(matchesRef);

        if (!existingMatches.empty) {
            if (!confirm("Matches already exist. Generate anyway?")) {
                setLoadingAutoMatches(false);
                return;
            }
        }

        let round = 1;

        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                await addDoc(matchesRef, {
                    homeTeamId: teams[i].id,
                    awayTeamId: teams[j].id,
                    round,
                    played: false,
                    score: null,
                    createdAt: serverTimestamp(),
                });
                round++;
            }
        }

        setLoadingAutoMatches(false);
        alert("Matches generated successfully.");
    }

    // ---------------------------------------------------
    // DELETE LEAGUE
    // ---------------------------------------------------
    async function handleDeleteLeague() {
        if (!confirm("⚠ This will permanently delete the league. Continue?")) return;

        setLoadingDeleteLeague(true);

        try {
            await deleteLeague(leagueId, league.ownerUid);
            alert("League deleted.");
            window.location.hash = "#/leagues";
        } catch (err) {
            console.error(err);
            alert("Error deleting league");
        }

        setLoadingDeleteLeague(false);
    }

    // ---------------------------------------------------
    // RENDER
    // ---------------------------------------------------
    return (
        <div className="space-y-6 mt-10">
            <h2 className="text-2xl font-bold text-red-600">Admin Panel</h2>

            <p className="text-gray-600">
                These actions are only available to the league owner.
            </p>

            {/* TEAMS */}
            <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Teams</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Remove all teams from the league.
                </p>

                <button
                    onClick={resetTeams}
                    disabled={loadingResetTeams}
                    className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loadingResetTeams ? "Removing..." : "Remove All Teams"}
                </button>
            </div>

            {/* MATCHES */}
            <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Matches</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Remove all matches from the league.
                </p>

                <button
                    onClick={resetMatches}
                    disabled={loadingResetMatches}
                    className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loadingResetMatches ? "Removing..." : "Remove All Matches"}
                </button>
            </div>

            {/* AUTO MATCHES */}
            <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                    Generate Matches Automatically
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                    Creates a round-robin schedule where every team plays once against all
                    others.
                </p>

                <button
                    onClick={generateAutoMatches}
                    disabled={loadingAutoMatches}
                    className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loadingAutoMatches ? "Generating..." : "Generate Matches"}
                </button>
            </div>

            {/* DELETE LEAGUE */}
            <div className="border p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-red-600 mb-2">
                    Delete League
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                    This action is irreversible.
                </p>

                <button
                    onClick={handleDeleteLeague}
                    disabled={loadingDeleteLeague}
                    className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loadingDeleteLeague ? "Deleting..." : "Delete League"}
                </button>
            </div>
        </div>
    );
}
