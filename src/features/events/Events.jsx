// src/features/events/Events.jsx
import React, { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { listenEvents, addEvent, joinEvent, leaveEvent } from "@/lib/firebase";
import { Container, Input, Button, Card } from "@/components/ui";
import SubscriptionRequired from "@/components/SubscriptionRequired";

export default function Events() {
  const { user, sub } = useAuth();
  const [events, setEvents] = useState([]);

  // Load events from Firestore
  useEffect(() => {
    const unsub = listenEvents(setEvents);
    return () => unsub();
  }, []);

  // Require subscription
  if (!user || !sub.active) {
    return <SubscriptionRequired />;
  }

  return (
    <Container>
      <Header />
      <CreateEventForm user={user} />
      <EventList events={events} user={user} />
    </Container>
  );
}

function Header() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold">Events & Activities</h1>
      <p className="text-gray-600">
        Create games, book courts and join local events.
      </p>
    </div>
  );
}

// ---------------------------
// Event Creation Form
// ---------------------------
function CreateEventForm({ user }) {
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [capacity, setCapacity] = useState(10);

  async function handleSubmit() {
    if (!title || !venue || !date) {
      return alert("Please fill out all fields.");
    }

    await addEvent({
      title,
      venue,
      date,
      capacity,
      ownerUid: user.uid,
    });

    setTitle("");
    setVenue("");
    setDate("");
    setCapacity(10);
  }

  return (
    <Card padding="md" className="mb-6">
      <h2 className="font-bold mb-3 text-lg">Create event</h2>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          placeholder="Venue"
          value={venue}
          onChange={(e) => setVenue(e.target.value)}
        />

        <Input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Input
          type="number"
          min="1"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
        />

        <Button variant="primary" onClick={handleSubmit}>
          Publish
        </Button>
      </div>
    </Card>
  );
}

// ---------------------------
// Event List
// ---------------------------
function EventList({ events, user }) {
  if (events.length === 0) {
    return <p className="text-gray-500">No events yet.</p>;
  }

  async function handleJoin(ev) {
    try {
      await joinEvent(ev.id, user.uid);
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleLeave(ev) {
    try {
      await leaveEvent(ev.id, user.uid);
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((ev) => {
        const attendees = ev.attendees || [];
        const isJoined = attendees.includes(user.uid);
        const isFull = attendees.length >= ev.capacity;

        return (
          <Card key={ev.id} padding="md" className="flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg">{ev.title}</h3>
              <p className="text-gray-600">{ev.venue}</p>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(ev.date).toLocaleString()}
              </p>

              <p className="mt-3 text-sm text-gray-600">
                {attendees.length} / {ev.capacity} attendees
              </p>
            </div>

            <div className="mt-4">
              {isJoined && (
                <Button
                  variant="gray"
                  className="w-full"
                  onClick={() => handleLeave(ev)}
                >
                  Leave event
                </Button>
              )}

              {!isJoined && !isFull && (
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => handleJoin(ev)}
                >
                  Join event
                </Button>
              )}

              {isFull && !isJoined && (
                <Button variant="danger" className="w-full" disabled>
                  Event full
                </Button>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
