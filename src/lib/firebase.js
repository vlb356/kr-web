// Firebase v9 modular — foro + eventos
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  deleteDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  runTransaction,
  increment,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// -------- Auth --------
export const onAuthChanged = (cb) => onAuthStateChanged(auth, cb);

export async function registerEmailPassword(username, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // nombre visible obligatorio
  await updateProfile(cred.user, { displayName: username });

  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    name: username,
    avatarUrl: null,
    bio: "",
    followers: [],
    following: [],
    createdAt: serverTimestamp(),
    subscription: { active: true, plan: "one-pass" }
  });

  return cred.user;
}

export async function loginEmailPassword(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}
export async function logout() { await signOut(auth); }

export async function ensureUserDoc(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: auth.currentUser?.email || "",
      name: auth.currentUser?.displayName || "",
      createdAt: serverTimestamp(),
      subscription: { active: true, plan: "one-pass" },
    });
  }
}
export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// -------- Subscripción --------
export async function setSubscriptionPlan(uid, plan) {
  const ref = doc(db, "users", uid);
  await setDoc(
    ref,
    {
      subscription: {
        active: !!plan,
        plan: plan || null,
        updatedAt: serverTimestamp(),
      },
    },
    { merge: true }
  );
}

// -------- Events --------
export function listenEvents(cb) {
  const qy = query(collection(db, "events"), orderBy("date", "asc"));
  return onSnapshot(qy, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}
export async function addEvent({ title, venue, date, capacity = 10, ownerUid }) {
  await addDoc(collection(db, "events"), {
    title, venue, date: date || "", capacity: Number(capacity) || 10,
    attendees: [], ownerUid: ownerUid || auth.currentUser?.uid || null,
    createdAt: serverTimestamp(),
  });
}
export async function joinEvent(eventId, uid) {
  const ref = doc(db, "events", eventId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Event not found");
    const data = snap.data();
    const attendees = data.attendees || [];
    if (attendees.includes(uid)) return;
    if (data.capacity && attendees.length >= data.capacity) {
      throw new Error("Event is full");
    }
    tx.update(ref, { attendees: arrayUnion(uid) });
  });
}
export async function leaveEvent(eventId, uid) {
  const ref = doc(db, "events", eventId);
  await updateDoc(ref, { attendees: arrayRemove(uid) });
}

// DELETE EVENT (only owner)
export async function deleteEvent(eventId, ownerUid) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");

  if (me !== ownerUid) {
    throw new Error("Only the event owner can delete this event");
  }

  await deleteDoc(doc(db, "events", eventId));
}


// --- FORUMS ---

// LISTEN FORUMS
export function listenForums(onData, onError) {
  const qy = query(collection(db, "forums"), orderBy("updatedAt", "desc"));
  return onSnapshot(
    qy,
    (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(rows);
    },
    (err) => {
      console.error("[listenForums] error:", err);
      if (onError) onError(err);
    }
  );
}

// GET FORUMS ONCE (NECESARIO PARA Social.jsx)
export async function getForumsOnce() {
  const qy = query(collection(db, "forums"), orderBy("updatedAt", "desc"));
  const snap = await getDocs(qy);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// CREATE FORUM (¡¡CORREGIDO!!)
export async function addForum({ title, description = "", tag = "general", ownerUid }) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  const ref = await addDoc(collection(db, "forums"), {
    title,
    description,
    tag,
    ownerUid: ownerUid || uid,
    ownerName:
      auth.currentUser?.displayName || auth.currentUser?.email || "User",
    posts: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return ref.id;
}

// GET A FORUM
export async function getForum(forumId) {
  const ref = doc(db, "forums", forumId);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

// LISTEN MESSAGES
export function listenForumMessages(forumId, cb, onError) {
  const qy = query(
    collection(db, "forums", forumId, "messages"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(
    qy,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => {
      console.error("[listenForumMessages] error:", err);
      onError?.(err);
    }
  );
}

// CREATE MESSAGE
export async function addForumMessage(forumId, text) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Please sign in first");

  const name =
    auth.currentUser?.displayName || auth.currentUser?.email || "User";

  await addDoc(collection(db, "forums", forumId, "messages"), {
    text,
    uid,
    name,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "forums", forumId), {
    posts: increment(1),
    updatedAt: serverTimestamp(),
  });
}


// DELETE A MESSAGE
export async function deleteForumMessage(forumId, msgId, msgOwnerUid) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");

  // Seguridad frontend (Firestore ya valida también)
  if (me !== msgOwnerUid) {
    throw new Error("You can only delete your own messages");
  }

  await deleteDoc(doc(db, "forums", forumId, "messages", msgId));

  await updateDoc(doc(db, "forums", forumId), {
    posts: increment(-1),
    updatedAt: serverTimestamp(),
  });
}


// DELETE A FORUM
export async function deleteForum(forumId, forumOwnerUid) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");

  if (me !== forumOwnerUid) {
    throw new Error("Only the owner can delete this forum");
  }

  const messagesRef = collection(db, "forums", forumId, "messages");
  const snap = await getDocs(messagesRef);

  // Borrado en paralelo
  const deletions = snap.docs.map((m) => deleteDoc(m.ref));
  await Promise.all(deletions);

  await deleteDoc(doc(db, "forums", forumId));
}


// ADD comment to a topic
export async function addComment(topicId, text) {
  const uid = auth.currentUser?.uid;
  const name =
    auth.currentUser?.displayName ||
    auth.currentUser?.email ||
    "User";

  if (!uid) throw new Error("Not authenticated");

  await addDoc(collection(db, "topics", topicId, "comments"), {
    uid,
    name,
    text,
    createdAt: serverTimestamp(),
  });
}

// LISTEN to comments inside a topic
export function listenComments(topicId, callback) {
  const q = query(
    collection(db, "topics", topicId, "comments"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

// Follow user
export async function followUser(targetUid) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");

  if (me === targetUid) throw new Error("You cannot follow yourself");

  // Add to MY "following"
  await setDoc(doc(db, "users", me, "following", targetUid), {
    uid: targetUid,
    createdAt: serverTimestamp(),
  });

  // Add to THEIR "followers"
  await setDoc(doc(db, "users", targetUid, "followers", me), {
    uid: me,
    createdAt: serverTimestamp(),
  });
}

// Unfollow user
export async function unfollowUser(targetUid) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");

  await deleteDoc(doc(db, "users", me, "following", targetUid));
  await deleteDoc(doc(db, "users", targetUid, "followers", me));
}

// Listen to followers count
export function listenFollowers(uid, callback) {
  const ref = collection(db, "users", uid, "followers");
  return onSnapshot(ref, snap => {
    callback(snap.docs.length);
  });
}

// Listen to following count
export function listenFollowing(uid, callback) {
  const ref = collection(db, "users", uid, "following");
  return onSnapshot(ref, snap => {
    callback(snap.docs.length);
  });
}

// Check if current user follows a given user
export async function isFollowing(targetUid) {
  const me = auth.currentUser?.uid;
  if (!me) return false;

  const ref = doc(db, "users", me, "following", targetUid);
  const snap = await getDoc(ref);
  return snap.exists();
}

// --------------------------
// LEAGUES
// --------------------------

export async function addLeague(data) {
  const ref = await addDoc(collection(db, "leagues"), {
    ...data,
    createdAt: serverTimestamp(),
    teams: [],
    matches: [],
    standings: [],
    participants: []
  });

  return ref.id;
}

// -------------------------------
// DELETE LEAGUE (FULL)
// -------------------------------
export async function deleteLeague(leagueId, ownerUid) {
  const current = auth.currentUser?.uid;

  if (!current) throw new Error("Not authenticated");
  if (current !== ownerUid) throw new Error("Only the owner can delete this league");

  // 1) DELETE TEAMS SUBCOLLECTION
  const teamsRef = collection(db, "leagues", leagueId, "teams");
  const teamsSnap = await getDocs(teamsRef);
  const teamDeletes = teamsSnap.docs.map((d) => deleteDoc(d.ref));

  await Promise.all(teamDeletes);

  // 2) DELETE MATCHES SUBCOLLECTION
  const matchesRef = collection(db, "leagues", leagueId, "matches");
  const matchesSnap = await getDocs(matchesRef);
  const matchDeletes = matchesSnap.docs.map((d) => deleteDoc(d.ref));

  await Promise.all(matchDeletes);

  // 3) DELETE THE LEAGUE DOCUMENT ITSELF
  await deleteDoc(doc(db, "leagues", leagueId));
}


// -------------------------------
// TEAMS
// -------------------------------
export async function createTeam(leagueId, { name }) {
  const ref = await addDoc(collection(db, "leagues", leagueId, "teams"), {
    name,
    members: [],
    createdAt: serverTimestamp()
  });

  // Update counter
  await updateDoc(doc(db, "leagues", leagueId), {
    teamCount: increment(1)
  });

  return ref.id;
}

export async function deleteTeam(leagueId, teamId) {
  await deleteDoc(doc(db, "leagues", leagueId, "teams", teamId));
  await updateDoc(doc(db, "leagues", leagueId), { teamCount: increment(-1) });
}


// -------------------------------
// MATCHES
// -------------------------------
export async function createMatch(leagueId, data) {
  await addDoc(collection(db, "leagues", leagueId, "matches"), {
    ...data,
    createdAt: serverTimestamp()
  });
}

export async function updateMatch(leagueId, matchId, data) {
  await updateDoc(doc(db, "leagues", leagueId, "matches", matchId), data);
}


// -------------------------------
// JOIN / LEAVE LEAGUE
// -------------------------------
export async function joinLeague(leagueId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  await updateDoc(doc(db, "leagues", leagueId), {
    participants: arrayUnion(uid)
  });
}

export async function leaveLeague(leagueId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  await updateDoc(doc(db, "leagues", leagueId), {
    participants: arrayRemove(uid)
  });
}

export {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  addDoc,
  deleteDoc,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment
};
