// src/features/social/Social.jsx
import React, { useEffect, useMemo, useState } from "react";
import { addForum, getForumsOnce, listenForums, deleteForum } from "@/lib/firebase";
import { auth } from "@/lib/firebase";

export default function Social({ user }) {
  const [forums, setForums] = useState([]);
  const [filter, setFilter] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tag, setTag] = useState("general");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentUid = auth.currentUser?.uid || "";

  // Initial load + realtime sync
  useEffect(() => {
    let unsub = () => { };
    (async () => {
      try {
        const first = await getForumsOnce();
        setForums(first);
      } catch (e) {
        console.error("[getForumsOnce] error:", e);
        setError(e?.message || "Could not load forums.");
      }
      unsub = listenForums(
        (rows) => setForums(rows),
        (err) => setError(err?.message || "Cannot read forums.")
      );
    })();
    return () => unsub && unsub();
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return forums;
    return forums.filter(
      (f) =>
        f?.title?.toLowerCase().includes(q) ||
        f?.description?.toLowerCase().includes(q)
    );
  }, [forums, filter]);

  async function onCreate(e) {
    e.preventDefault();
    setError("");

    if (!user?.uid) {
      setError("You must be logged in.");
      return;
    }
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    setLoading(true);
    try {
      await addForum({
        title: title.trim(),
        description: desc.trim(),
        tag,
        ownerUid: currentUid,
        ownerName: user?.name || user?.email || "User",
      });

      setTitle("");
      setDesc("");
      setTag("general");
    } catch (err) {
      console.error(err);
      setError(err?.message || "Could not create forum.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* FILTER */}
      <div className="mb-6">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter forums by title..."
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* CREATE FORUM */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">Create forum</h2>

        {error && (
          <div className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Short description"
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-blue-200"
          />

          <div className="flex gap-3">
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="general">general</option>
              <option value="padel">padel</option>
              <option value="basket">basket</option>
              <option value="volleyball">volleyball</option>
              <option value="gym">gym</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-gray-900 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>

      {/* LIST OF FORUMS */}
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-500">No forums found.</p>
        ) : (
          filtered.map((f) => (
            <ForumCard key={f.id} f={f} currentUid={currentUid} />
          ))
        )}
      </div>
    </div>
  );
}

function ForumCard({ f, currentUid }) {
  const when =
    f?.updatedAt?.seconds
      ? new Date(f.updatedAt.seconds * 1000).toLocaleString()
      : "—";

  async function handleDelete() {
    if (!confirm("Delete this forum and its messages?")) return;
    await deleteForum(f.id);
  }

  return (
    <div className="kr-card hover:shadow-md transition-shadow relative">
      {/* OWNER DELETE BUTTON */}
      {f.ownerUid === currentUid && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-red-600 text-xs hover:underline"
        >
          Delete
        </button>
      )}

      <a href={`#/forum/${f.id}`} className="block">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {f?.tag || "general"}
          </span>
          <span className="text-xs text-gray-400">updated {when}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900">
          {f.title}
        </h3>

        {f.description && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
            {f.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{f?.posts || 0} posts</span>
          <span>by {f?.ownerName || "User"}</span>
        </div>
      </a>
    </div>
  );
}
