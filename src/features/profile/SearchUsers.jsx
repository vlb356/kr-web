import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";
import { followUser, unfollowUser, isFollowing } from "@/lib/firebase";

export default function SearchUsers() {
    const { user } = useAuth();
    const [list, setList] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function load() {
            const snap = await getDocs(
                query(collection(db, "users"), orderBy("name"))
            );
            const arr = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .filter((u) => u.id !== user?.uid);
            setList(arr);
        }
        load();
    }, []);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Search Users</h1>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full mb-6 px-4 py-2 border rounded-xl"
            />

            <div className="space-y-4">
                {list
                    .filter(
                        (u) =>
                            u.name?.toLowerCase().includes(search.toLowerCase()) ||
                            u.email?.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((u) => (
                        <UserLine key={u.id} u={u} />
                    ))}
            </div>
        </div>
    );
}

function UserLine({ u }) {
    const [following, setFollowing] = useState(false);

    useEffect(() => {
        async function check() {
            const is = await isFollowing(u.id);
            setFollowing(is);
        }
        check();
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

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border shadow-sm">
            <div>
                <a href={`#/profile/${u.id}`} className="text-lg font-medium text-blue-600">
                    {u.name}
                </a>
                <div className="text-gray-500 text-sm">{u.email}</div>
            </div>

            <button
                onClick={toggle}
                className={`px-4 py-2 rounded-full text-sm font-semibold ${following ? "bg-gray-200 text-gray-800" : "bg-blue-600 text-white"
                    }`}
            >
                {following ? "Following" : "Follow"}
            </button>
        </div>
    );
}
