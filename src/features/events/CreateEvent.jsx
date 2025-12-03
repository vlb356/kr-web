// src/features/events/CreateEvent.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addEvent } from "@/lib/firebase";
import useAuth from "@/hooks/useAuth";

export default function CreateEvent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to create an event.");
      return;
    }
    if (!title || !venue || !date) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await addEvent({
        title,
        venue,
        date,
        capacity,
        ownerUid: user.uid,
      });

      // Limpia el formulario y vuelve a la lista
      setTitle("");
      setVenue("");
      setDate("");
      setCapacity(10);
      navigate("/events");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#122944]">Create Event</h1>
        <p className="text-sm text-gray-500 mt-1">
          Publish a new activity so other players can join.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="kr-card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event title
          </label>
          <input
            type="text"
            className="w-full kr-input border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1662A6] focus:border-[#1662A6]"
            placeholder="5v5 Basketball at VMU court"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Venue
          </label>
          <input
            type="text"
            className="w-full kr-input border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1662A6] focus:border-[#1662A6]"
            placeholder="VMU Sports Hall, Kaunas"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date & time
            </label>
            <input
              type="datetime-local"
              className="w-full kr-input border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1662A6] focus:border-[#1662A6]"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              min={1}
              className="w-full kr-input border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1662A6] focus:border-[#1662A6]"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value) || 1)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full kr-btn-primary rounded-xl py-2 font-semibold disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
