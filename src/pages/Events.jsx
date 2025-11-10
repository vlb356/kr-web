import React, { useEffect, useState } from "react";
import { addEvent, joinEvent, leaveEvent, listenEvents, auth } from "../lib/firebase";

export default function Events({ user, sub }) {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: "", venue: "", date: "", capacity: 10 });
  const canCreate = !!user && sub?.active;

  useEffect(() => {
    const unsub = listenEvents(setEvents);
    return () => unsub();
  }, []);

  async function onCreate(e) {
    e.preventDefault();
    if (!canCreate) return;
    if (!form.title.trim() || !form.venue.trim()) return;
    await addEvent({ ...form, ownerUid: user?.uid });
    setForm({ title: "", venue: "", date: "", capacity: 10 });
  }

  return (
    <div className="kr-container space-y-6 py-6">
      {/* Hero */}
      <section className="kr-card-lg bg-gradient-to-br from-white to-neutral-100">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-gray-600">Activities</div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Events & Activities
            </h1>
            <p className="text-gray-600 mt-2">
              Create games, book courts and join local events.
            </p>
          </div>
          <div>
            {sub?.active ? (
              <span className="kr-badge-ok">Subscribed</span>
            ) : (
              <a href="#/subscribe" className="kr-btn">Subscribe to create</a>
            )}
          </div>
        </div>
      </section>

      {/* Create event */}
      <section className="kr-card">
        <h2 className="font-semibold mb-3">Create event</h2>

        {!canCreate && (
          <div className="text-xs text-amber-700 bg-amber-50 rounded-xl p-2 mb-3">
            You must be logged in and subscribed to create events.
          </div>
        )}

        <form onSubmit={onCreate} className="grid gap-2 md:grid-cols-4">
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="border rounded-xl px-3 py-2"
            placeholder="Venue"
            value={form.venue}
            onChange={(e) => setForm({ ...form, venue: e.target.value })}
          />
          <input
            type="datetime-local"
            className="border rounded-xl px-3 py-2"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              className="border rounded-xl px-3 py-2 w-24"
              type="number"
              min={1}
              placeholder="Capacity"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
            />
            <button className="kr-btn-primary" disabled={!canCreate}>
              Publish
            </button>
          </div>
        </form>
      </section>

      {/* Events list */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((ev) => {
          const attendees = ev.attendees || [];
          const me = auth.currentUser?.uid || "";
          const amIn = attendees.includes(me);
          const left = Math.max((ev.capacity || 0) - attendees.length, 0);

          async function onJoin() {
            try { await joinEvent(ev.id, me); } catch (e) { alert(e.message); }
          }
          async function onLeave() {
            try { await leaveEvent(ev.id, me); } catch (e) { alert(e.message); }
          }

          return (
            <div key={ev.id} className="kr-card flex flex-col gap-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-gray-600">{ev.venue || "Venue"}</div>
                  <div className="font-semibold text-lg">{ev.title}</div>
                </div>
                <span
                  className={cx(
                    "kr-badge",
                    left === 0 ? "border-red-300 text-red-700 bg-red-50" : "border-gray-300"
                  )}
                  title="Slots left"
                >
                  {left} left
                </span>
              </div>

              {/* Meta */}
              <div className="text-sm text-gray-600">
                {ev.date ? new Date(ev.date).toLocaleString() : "TBA"}
              </div>

              {/* Actions */}
              <div className="mt-auto flex items-center gap-2">
                {!amIn ? (
                  <button
                    onClick={onJoin}
                    className="kr-btn-primary"
                    disabled={!user || left === 0}
                  >
                    Join
                  </button>
                ) : (
                  <button onClick={onLeave} className="kr-btn">
                    Leave
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="kr-card col-span-full">
            <div className="text-sm text-gray-500">No events yet.</div>
          </div>
        )}
      </section>
    </div>
  );
}

// util local
function cx(...c) { return c.filter(Boolean).join(" "); }
