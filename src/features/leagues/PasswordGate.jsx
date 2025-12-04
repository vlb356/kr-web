import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import useAuth from "@/hooks/useAuth";
import { useNavigate, useParams, useNavigationType } from "react-router-dom";

export default function PasswordGate() {
    const { leagueId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [league, setLeague] = useState(null);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [anim, setAnim] = useState(false);

    const navType = useNavigationType();
    const comingFromBack = navType === "POP";

    useEffect(() => {
        async function load() {
            const snap = await getDoc(doc(db, "leagues", leagueId));

            if (snap.exists()) {
                setLeague({ id: snap.id, ...snap.data() });
            } else {
                setLeague(null);
            }
        }

        load();
        setTimeout(() => setAnim(true), 40);
    }, [leagueId]);

    // STILL LOADING
    if (!league) {
        return <div className="p-10 text-center animate-pulse">Loading…</div>;
    }

    // PUBLIC LEAGUE (isPrivate = false)
    if (!league.isPrivate) {
        navigate(`/league/${leagueId}`, { replace: true });
    }

    // OWNER ALWAYS ENTERS
    if (user?.uid === league.ownerUid && !comingFromBack) {
        navigate(`/league/${leagueId}`, { replace: true });
    }

    const accessKey = `kr_league_access_${leagueId}`;
    const remembered = localStorage.getItem(accessKey);

    // REMEMBERED ACCESS
    if (remembered === "true" && !comingFromBack) {
        navigate(`/league/${leagueId}`, { replace: true });
    }

    // SUBMIT PASSWORD
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (!league.password) {
            // if league has no password stored → allow access
            navigate(`/league/${leagueId}`, { replace: true });
            return;
        }

        if (password.trim() === league.password.trim()) {
            localStorage.setItem(accessKey, "true");
            navigate(`/league/${leagueId}`, { replace: true });
        } else {
            setError("Incorrect password, please try again.");
        }
    }

    // RENDER UI
    return (
        <div className="min-h-screen flex items-center justify-center p-6">

            <div
                className={`
                    bg-white w-full max-w-md p-8 rounded-xl shadow-xl border
                    transform transition-all duration-500
                    ${anim ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                `}
            >
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-6 top-6 text-[#1662A6] hover:underline"
                >
                    ← Back
                </button>

                <h1 className="text-3xl font-bold text-center text-[#122944] mb-4">
                    Private League
                </h1>

                <p className="text-gray-500 text-center mb-8">
                    Enter the password to access this league.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="password"
                        className="w-full border p-3 rounded-lg"
                        placeholder="League password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && (
                        <div className="text-red-500 text-sm text-center font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="
                            w-full bg-[#1662A6] text-white p-3 rounded-lg font-semibold text-lg
                            hover:bg-[#124f84] transition
                        "
                    >
                        Access League
                    </button>
                </form>
            </div>
        </div>
    );
}
