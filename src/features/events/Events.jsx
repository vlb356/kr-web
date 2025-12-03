// src/features/events/Events.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listenEvents, joinEvent, leaveEvent, deleteEvent } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

export default function Events() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    const unsub = listenEvents((rows) => setEvents(rows || []));
    return () => unsub && unsub();
  }, []);

  function handleCreate() {
    navigate("/create-event");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-[#122944]">Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            Join sport activities created by the community.
          </p>
        </div>

        {/* Botón naranja KR (mismo que Social) */}
        <button
          onClick={handleCreate}
          className="px-5 py-2.5 rounded-xl text-white font-semibold bg-[#E96F19] shadow-md hover:bg-[#cf5f15] transition border-none"
        >
          + Create Event
        </button>
      </div>

      {/* LISTA */}
      {events.length === 0 ? (
        <div className="kr-card text-center text-gray-500">
          No events yet. Be the first one to create one!
        </div>
      ) : (
        <div className="space-y-5">
          {events.map((ev) => (
            <EventCard key={ev.id} ev={ev} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

function EventCard({ ev, user }) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const joined = user ? (ev.attendees || []).includes(user.uid) : false;
  const isOwner = user && ev.ownerUid === user.uid;

  async function handleToggleJoin() {
    if (!user) return alert("Please log in first.");
    setLoading(true);

    try {
      if (joined) {
        await leaveEvent(ev.id, user.uid);
      } else {
        await joinEvent(ev.id, user.uid);
      }
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  }

  async function handleDelete() {
    if (!isOwner) return;
    const ok = window.confirm("Do you really want to delete this event?");
    if (!ok) return;

    setDeleting(true);
    try {
      await deleteEvent(ev.id, ev.ownerUid);
    } catch (err) {
      alert(err.message);
    }
    setDeleting(false);
  }

  return (
    <div className="kr-card flex flex-col md:flex-row md:items-center md:justify-between gap-5 py-5">
      {/* INFO */}
      <div>
        <h3 className="text-xl font-semibold text-[#122944]">{ev.title}</h3>
        <p className="text-sm text-gray-600">{ev.venue}</p>

        <div className="flex flex-wrap items-center gap-6 mt-2 text-gray-500 text-sm">
          <div>
            <span className="font-semibold">Date:</span>{" "}
            {ev.date ? new Date(ev.date).toLocaleString() : "—"}
          </div>

          <div>
            <span className="font-semibold">Attendees:</span>{" "}
            {(ev.attendees || []).length}/{ev.capacity || 10}
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleJoin}
          disabled={loading || deleting}
          className={`px-6 py-2.5 rounded-full font-semibold shadow-md transition ${joined
              ? "bg-gray-100 text-gray-800 border border-gray-300"
              : "bg-[#1662A6] text-white hover:bg-[#0f4a7d]"
            }`}
        >
          {loading ? "Please wait..." : joined ? "Leave Event" : "Join Event"}
        </button>

        {isOwner && (
          <button
            onClick={handleDelete}
            disabled={deleting || loading}
            className="text-sm text-red-600 hover:text-red-800"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
}
