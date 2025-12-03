// src/features/social/Social.jsx
import React, { useEffect, useState } from "react";
import {
  listenForums,
  addForum,
  getForumsOnce,
} from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import { Link } from "react-router-dom";

export default function Social() {
  const [forums, setForums] = useState([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tag, setTag] = useState("general");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const unsub = listenForums((rows) => {
      setForums(rows);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  async function handleCreateForum(e) {
    e.preventDefault();
    setCreating(true);

    try {
      await addForum({
        title,
        description: desc,
        tag,
        ownerUid: auth.currentUser.uid, // 🔥 OBLIGATORIO
      });

      setTitle("");
      setDesc("");
      setTag("general");
      setOpen(false);
    } catch (err) {
      alert("Error: " + err.message);
    }

    setCreating(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Community Forums</h1>

        <button
          onClick={() => setOpen(true)}
          className="px-5 py-2 rounded-xl bg-orange-600 text-white font-semibold shadow hover:bg-orange-700"
        >
          + New Forum
        </button>
      </div>

      {open && (
        <div className="bg-white border rounded-xl p-6 shadow mb-10">
          <h2 className="text-2xl font-bold mb-4">Create a Forum</h2>

          <form onSubmit={handleCreateForum} className="space-y-4">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Forum title"
              className="w-full border rounded-lg px-4 py-2"
            />

            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Description..."
              className="w-full border rounded-lg px-4 py-2 h-24"
            />

            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="general">General</option>
              <option value="football">Football</option>
              <option value="basket">Basketball</option>
              <option value="gym">Gym & Fitness</option>
            </select>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={creating}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700"
              >
                {creating ? "Creating..." : "Create"}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-5 py-2 border rounded-lg font-semibold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-gray-500 text-center">Loading forums…</div>
      ) : forums.length === 0 ? (
        <div className="text-gray-500 text-center">
          No forums created yet. Be the first!
        </div>
      ) : (
        <div className="space-y-4">
          {forums.map((f) => (
            <Link
              key={f.id}
              to={`/forum/${f.id}`}
              className="block bg-white border rounded-xl p-5 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">{f.title}</h2>
                  <p className="text-gray-500">{f.description || "No description"}</p>
                </div>

                <span className="px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-600 font-semibold">
                  {f.tag}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
