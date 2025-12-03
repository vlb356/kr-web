// src/features/social/ForumDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getForum,
  listenForumMessages,
  addForumMessage,
  deleteForumMessage,
  deleteForum
} from "@/lib/firebase";

import useAuth from "@/hooks/useAuth";

export default function ForumDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [forum, setForum] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingForum, setLoadingForum] = useState(true);
  const [text, setText] = useState("");

  // Load forum details
  useEffect(() => {
    async function load() {
      const f = await getForum(id);
      setForum(f);
      setLoadingForum(false);
    }
    load();
  }, [id]);

  // Messages listener
  useEffect(() => {
    const unsub = listenForumMessages(
      id,
      (msgs) => {
        setMessages(msgs);
      },
      (err) => console.error(err)
    );

    return () => unsub();
  }, [id]);

  if (loadingForum) {
    return (
      <div className="p-10 text-center text-gray-500 text-xl">
        Loading forum…
      </div>
    );
  }

  if (!forum) {
    return (
      <div className="p-10 text-center text-gray-500 text-xl">
        Forum not found.
      </div>
    );
  }

  // ------------------------------
  // SEND MESSAGE
  // ------------------------------
  async function handleSend(e) {
    e.preventDefault();

    if (!text.trim()) return;

    try {
      await addForumMessage(id, text.trim());
      setText("");
    } catch (err) {
      alert(err.message);
    }
  }

  // ------------------------------
  // DELETE MESSAGE
  // ------------------------------
  async function handleDeleteMessage(msgId, msgOwnerUid) {
    try {
      await deleteForumMessage(id, msgId, msgOwnerUid);
    } catch (err) {
      alert(err.message);
    }
  }

  // ------------------------------
  // DELETE FORUM
  // ------------------------------
  async function handleDeleteForum() {
    if (!confirm("Are you sure you want to delete the entire forum?")) return;

    try {
      await deleteForum(id, forum.ownerUid);
      window.location.hash = "/social";
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  const isOwner = user?.uid === forum.ownerUid;
  const initial =
    forum.ownerName?.charAt(0)?.toUpperCase() ||
    forum.ownerEmail?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* HEADER */}
      <div className="mb-8 p-6 rounded-xl bg-[#132237] text-white shadow-lg">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{forum.title}</h1>

          {isOwner && (
            <button
              onClick={handleDeleteForum}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-sm shadow"
            >
              Delete forum
            </button>
          )}
        </div>

        {forum.description && (
          <p className="mt-2 text-gray-300">{forum.description}</p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-800 text-white font-bold">
            {initial}
          </div>
          <span className="text-gray-300">
            Created by <strong>{forum.ownerName}</strong>
          </span>
        </div>
      </div>

      {/* MESSAGES LIST */}
      <div className="space-y-4 mb-8">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No messages yet. Be the first!
          </div>
        )}

        {messages.map((m) => {
          const msgInitial =
            m.name?.charAt(0)?.toUpperCase() ||
            m.email?.charAt(0)?.toUpperCase() ||
            "U";

          const isMyMessage = user?.uid === m.uid;

          return (
            <div
              key={m.id}
              className="relative bg-white border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              {/* Delete */}
              {isMyMessage && (
                <button
                  onClick={() => handleDeleteMessage(m.id, m.uid)}
                  className="absolute top-3 right-3 text-red-600 text-sm hover:underline"
                >
                  Delete
                </button>
              )}

              <div className="flex items-center gap-3 mb-2">
                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-[#132237] text-white font-semibold">
                  {msgInitial}
                </div>
                <strong>{m.name}</strong>
              </div>

              <div className="text-gray-800">{m.text}</div>
            </div>
          );
        })}
      </div>

      {/* ADD MESSAGE */}
      <form onSubmit={handleSend} className="mt-6 p-5 bg-white rounded-xl border shadow">
        <textarea
          className="w-full border rounded-xl p-3 h-24 resize-none"
          placeholder="Write a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          type="submit"
          className="mt-3 w-full py-3 bg-[#132237] text-white rounded-xl font-semibold hover:bg-[#0d1828] transition"
        >
          Send message
        </button>
      </form>
    </div>
  );
}
