// src/features/search/Search.jsx
import React, { useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";
import { followUser, unfollowUser, isFollowing } from "@/lib/firebase";

export default function SearchUsers() {
    const { user } = useAuth();
    const [search, setSearch] = useState("");
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSearch(e) {
        e.preventDefault();
        if (!search.trim()) return;

        setLoading(true);

        const snap = await getDocs(
            query(collection(db, "users"), orderBy("name"))
        );

        const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        const found = all.filter(
            (u) =>
                (u.name || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                (u.email || "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
        );

        setResults(found.length ? found : []);
        setLoading(false);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* HEADER ZONE */}
            <div className="w-full bg-gradient-to-r from-[#0B1F36] to-[#122944] py-14 px-6 text-white text-center shadow-lg">
                <h1 className="text-4xl font-bold mb-2">Find players & teammates</h1>
                <p className="opacity-80 mb-6">
                    Search by username or email to follow other athletes.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="max-w-xl mx-auto flex items-center bg-white rounded-full shadow-lg overflow-hidden"
                >
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="flex-1 px-5 py-3 text-gray-700 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-[#1662A6] px-6 py-3 text-white font-semibold hover:bg-[#0e4b80] transition"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* RESULTS */}
            <div className="max-w-3xl mx-auto px-6 py-12">
                {loading && (
                    <p className="text-center text-gray-600">Searching...</p>
                )}

                {!loading && results !== null && results.length === 0 && (
                    <p className="text-center text-gray-600 mt-10 text-lg">
                        No users found.
                    </p>
                )}

                {!loading && results && results.length > 0 && (
                    <div className="space-y-4">
                        {results.map((u) => (
                            <UserLine key={u.id} u={u} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function UserLine({ u }) {
    const { user } = useAuth();
    const [following, setFollowing] = useState(false);

    React.useEffect(() => {
        async function load() {
            const is = await isFollowing(u.id);
            setFollowing(is);
        }
        load();
    }, [u.id]);

    async function toggle() {
        if (following) {
            await unfollowUser(u.id);
            setFollowing(false);
        } else {
            await followUser(u.id);
            setFollowing(true);
        }
    }

    const initial =
        u.name?.charAt(0)?.toUpperCase() ||
        u.email?.charAt(0)?.toUpperCase() ||
        "U";

    return (
        <div className="flex items-center justify-between p-5 bg-white rounded-xl shadow border">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#122944] text-white text-lg font-bold">
                    {initial}
                </div>

                <div>
                    <a
                        href={`#/profile/${u.id}`}
                        className="text-lg font-semibold text-[#1662A6] hover:underline"
                    >
                        {u.name}
                    </a>
                    <p className="text-gray-500 text-sm">{u.email}</p>
                </div>
            </div>

            {user?.uid !== u.id && (
                <button
                    onClick={toggle}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${following
                            ? "bg-gray-200 text-gray-800"
                            : "bg-[#1662A6] text-white hover:bg-[#0e4b80]"
                        }`}
                >
                    {following ? "Following" : "Follow"}
                </button>
            )}
        </div>
    );
}
