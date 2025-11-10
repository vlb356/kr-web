import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { addForumMessage } from "../lib/firebase";

export default function ForumDetail({ forumId }) {
  const [forum, setForum] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!forumId) return;
    const unsub = onSnapshot(doc(db, "forums", forumId), (snap) => {
      setForum(snap.exists() ? { id: snap.id, ...snap.data() } : null);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [forumId]);

  useEffect(() => {
    if (!forumId) return;
    const qy = query(
      collection(db, "forums", forumId, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(qy, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub && unsub();
  }, [forumId]);

  async function send(e) {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    await addForumMessage(forumId, v);
    setText("");
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-gray-500">Loading…</div>;
  }
  if (!forum) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-rose-700">Forum not found</h2>
          <a href="#/social" className="inline-block mt-3 text-kr-blue underline">
            ← Back to forums
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <a href="#/social" className="text-sm text-kr-blue underline">← Back</a>
          <h1 className="mt-1 text-2xl font-bold">{forum.title}</h1>
          <p className="text-gray-500">{forum.description || " "}</p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {forum.tag}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <ul className="space-y-3">
          {messages.map((m) => (
            <li key={m.id} className="border border-gray-100 rounded-xl px-4 py-3 bg-gray-50">
              <div className="text-sm text-gray-800">{m.text}</div>
              <div className="mt-1 text-xs text-gray-500">{m.name || "User"}</div>
            </li>
          ))}
          {messages.length === 0 && (
            <li className="text-sm text-gray-500">No messages yet.</li>
          )}
        </ul>

        <form onSubmit={send} className="mt-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a message…"
            className="flex-1 h-11 rounded-xl border border-gray-300 px-3 outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button type="submit" className="h-11 px-5 rounded-xl bg-gray-900 text-white hover:bg-gray-800">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
