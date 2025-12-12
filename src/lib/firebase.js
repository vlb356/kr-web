// ----------------------------------------------------
//  Firebase v9 Modular — Komanda Ryšys (Full Version)
// ----------------------------------------------------
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

// ----------------------------------------------------
//  Firebase Init
// ----------------------------------------------------
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

// ----------------------------------------------------
//  AUTH
// ----------------------------------------------------
export const onAuthChanged = (cb) => onAuthStateChanged(auth, cb);

export async function registerEmailPassword(username, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName: username });

  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    name: username,
    avatarUrl: null,
    bio: "",
    followers: [],
    following: [],
    createdAt: serverTimestamp(),
    subscription: { active: true, plan: "one-pass" },
  });

  return cred.user;
}

export async function loginEmailPassword(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function logout() {
  await signOut(auth);
}

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

// ----------------------------------------------------
//  SUBSCRIPTIONS
// ----------------------------------------------------
export async function setSubscriptionPlan(uid, plan) {
  await setDoc(
    doc(db, "users", uid),
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

// ----------------------------------------------------
//  EVENTS
// ----------------------------------------------------
export function listenEvents(cb) {
  const qy = query(collection(db, "events"), orderBy("date", "asc"));
  return onSnapshot(qy, (snap) =>
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  );
}

export async function addEvent({ title, venue, date, capacity = 10, ownerUid }) {
  await addDoc(collection(db, "events"), {
    title,
    venue,
    date: date || "",
    capacity: Number(capacity) || 10,
    attendees: [],
    ownerUid: ownerUid || auth.currentUser?.uid || null,
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

    if (data.capacity && attendees.length >= data.capacity)
      throw new Error("Event is full");

    tx.update(ref, { attendees: arrayUnion(uid) });
  });
}

export async function leaveEvent(eventId, uid) {
  await updateDoc(doc(db, "events", eventId), {
    attendees: arrayRemove(uid),
  });
}

export async function deleteEvent(eventId, ownerUid) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");
  if (me !== ownerUid) throw new Error("Only the owner can delete this event");

  await deleteDoc(doc(db, "events", eventId));
}

// ----------------------------------------------------
//  FORUMS
// ----------------------------------------------------
export function listenForums(onData, onError) {
  const qy = query(collection(db, "forums"), orderBy("updatedAt", "desc"));

  return onSnapshot(
    qy,
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => onError?.(err)
  );
}

export async function getForumsOnce() {
  const snap = await getDocs(
    query(collection(db, "forums"), orderBy("updatedAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

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

export async function getForum(forumId) {
  const snap = await getDoc(doc(db, "forums", forumId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function listenForumMessages(forumId, cb, onError) {
  const qy = query(
    collection(db, "forums", forumId, "messages"),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(
    qy,
    (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    (err) => onError?.(err)
  );
}

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

export async function deleteForumMessage(forumId, msgId, msgOwnerUid) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");
  if (me !== msgOwnerUid)
    throw new Error("You can only delete your own messages");

  await deleteDoc(doc(db, "forums", forumId, "messages", msgId));

  await updateDoc(doc(db, "forums", forumId), {
    posts: increment(-1),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteForum(forumId, ownerUid) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");
  if (me !== ownerUid) throw new Error("Only the owner can delete this forum");

  const messages = await getDocs(collection(db, "forums", forumId, "messages"));
  await Promise.all(messages.docs.map((m) => deleteDoc(m.ref)));

  await deleteDoc(doc(db, "forums", forumId));
}

// ----------------------------------------------------
//  FOLLOW SYSTEM
// ----------------------------------------------------
export async function followUser(targetUid) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");
  if (me === targetUid) throw new Error("You cannot follow yourself");

  await setDoc(doc(db, "users", me, "following", targetUid), {
    uid: targetUid,
    createdAt: serverTimestamp(),
  });

  await setDoc(doc(db, "users", targetUid, "followers", me), {
    uid: me,
    createdAt: serverTimestamp(),
  });
}

export async function unfollowUser(targetUid) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");

  await deleteDoc(doc(db, "users", me, "following", targetUid));
  await deleteDoc(doc(db, "users", targetUid, "followers", me));
}

export function listenFollowers(uid, cb) {
  return onSnapshot(collection(db, "users", uid, "followers"), (snap) =>
    cb(snap.docs.length)
  );
}

export function listenFollowing(uid, cb) {
  return onSnapshot(collection(db, "users", uid, "following"), (snap) =>
    cb(snap.docs.length)
  );
}

export async function isFollowing(targetUid) {
  const me = auth.currentUser?.uid;
  if (!me) return false;

  const snap = await getDoc(doc(db, "users", me, "following", targetUid));
  return snap.exists();
}

// ----------------------------------------------------
//  LEAGUES PRO — NEW MODEL
// ----------------------------------------------------
export async function createLeague({
  name,
  sport,
  format,
  venue,
  visibility,
  passwordHash = null,
}) {
  const ownerUid = auth.currentUser?.uid;
  if (!ownerUid) throw new Error("Not authenticated");

  const ref = await addDoc(collection(db, "leagues"), {
    name,
    sport,
    format,
    venue,
    visibility,
    passwordHash,
    ownerUid,
    createdAt: serverTimestamp(),
    participants: [ownerUid],
  });

  return ref.id;
}

export async function joinLeague(leagueId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  await updateDoc(doc(db, "leagues", leagueId), {
    participants: arrayUnion(uid),
  });
}

export async function leaveLeague(leagueId) {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error("Not authenticated");

  await updateDoc(doc(db, "leagues", leagueId), {
    participants: arrayRemove(uid),
  });
}

// ----------------------------------------------------
//  DELETE LEAGUE (FULL)
// ----------------------------------------------------
export async function deleteLeague(leagueId) {
  const me = auth.currentUser?.uid;
  if (!me) throw new Error("Not authenticated");

  const leagueRef = doc(db, "leagues", leagueId);
  const snap = await getDoc(leagueRef);

  if (!snap.exists()) throw new Error("League not found");
  if (snap.data().ownerUid !== me)
    throw new Error("Only the owner can delete this league");

  // delete teams
  const teamsSnap = await getDocs(collection(db, "leagues", leagueId, "teams"));
  await Promise.all(teamsSnap.docs.map((d) => deleteDoc(d.ref)));

  // delete matches
  const matchesSnap = await getDocs(
    collection(db, "leagues", leagueId, "matches")
  );
  await Promise.all(matchesSnap.docs.map((d) => deleteDoc(d.ref)));

  // delete league
  await deleteDoc(leagueRef);
}

// -----------------------------
// TEAMS PRO
// -----------------------------

// Crear equipo con roles y limite
export async function createTeam(leagueId, { name, color, maxPlayers = 5 }) {
  const initials = name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const ref = await addDoc(collection(db, "leagues", leagueId, "teams"), {
    name,
    initials,
    color,
    maxPlayers: Number(maxPlayers),
    captainUid: null,         // se asigna luego
    members: [],
    createdAt: serverTimestamp(),
  });

  return ref.id;
}

// Actualizar equipo (nombre, color, maxPlayers)
export async function updateTeam(leagueId, teamId, data) {
  return updateDoc(doc(db, "leagues", leagueId, "teams", teamId), data);
}

// Establecer capitán del equipo
export async function setCaptain(leagueId, teamId, uid) {
  return updateDoc(doc(db, "leagues", leagueId, "teams", teamId), {
    captainUid: uid,
  });
}

// Añadir jugador al equipo
export async function joinTeam(leagueId, teamId, uid) {
  const teamRef = doc(db, "leagues", leagueId, "teams", teamId);
  const allTeamsRef = collection(db, "leagues", leagueId, "teams");

  await runTransaction(db, async (tx) => {
    const teamSnap = await tx.get(teamRef);
    if (!teamSnap.exists()) throw new Error("Team not found");

    const team = teamSnap.data();
    const members = team.members || [];

    // Comprobar si está lleno
    if (members.length >= team.maxPlayers) {
      throw new Error("Team is full");
    }

    // Comprobar si pertenece a otro equipo
    const allTeamsSnap = await getDocs(allTeamsRef);
    for (const t of allTeamsSnap.docs) {
      const data = t.data();
      if (data.members?.includes(uid) && t.id !== teamId) {
        throw new Error("User is already in another team");
      }
    }

    tx.update(teamRef, {
      members: arrayUnion(uid),
    });

    // Si no hay capitán → el primero que entra lo es
    if (!team.captainUid) {
      tx.update(teamRef, { captainUid: uid });
    }
  });
}

// Salir del equipo
export async function leaveTeam(leagueId, teamId, uid) {
  const ref = doc(db, "leagues", leagueId, "teams", teamId);
  await updateDoc(ref, {
    members: arrayRemove(uid),
  });
}

// El owner puede expulsar jugadores
export async function kickPlayer(leagueId, teamId, uid) {
  const ref = doc(db, "leagues", leagueId, "teams", teamId);
  await updateDoc(ref, {
    members: arrayRemove(uid),
  });
}

// Borrar equipo
export async function deleteTeam(leagueId, teamId) {
  await deleteDoc(doc(db, "leagues", leagueId, "teams", teamId));
}


// ----------------------------------------------------
//  MATCHES — With Captain Double Confirmation
// ----------------------------------------------------
export async function createMatch(leagueId, { teamA, teamB, date }) {
  const ref = await addDoc(collection(db, "leagues", leagueId, "matches"), {
    teamA,
    teamB,
    proposedScores: {},
    finalScoreA: null,
    finalScoreB: null,
    date,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return ref.id;
}

export async function proposeScore(leagueId, matchId, uid, scoreA, scoreB) {
  const ref = doc(db, "leagues", leagueId, "matches", matchId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Match not found");

    const data = snap.data();
    const proposed = {
      ...(data.proposedScores || {}),
      [uid]: { scoreA, scoreB },
    };

    let finalScoreA = data.finalScoreA;
    let finalScoreB = data.finalScoreB;
    let status = "waiting_confirmation";

    const values = Object.values(proposed);
    if (values.length >= 2) {
      const [a, b] = values;
      if (a.scoreA === b.scoreA && a.scoreB === b.scoreB) {
        finalScoreA = a.scoreA;
        finalScoreB = a.scoreB;
        status = "confirmed";
      }
    }

    tx.update(ref, {
      proposedScores: proposed,
      finalScoreA,
      finalScoreB,
      status,
    });
  });
}

export async function forceScore(leagueId, matchId, scoreA, scoreB) {
  const owner = auth.currentUser?.uid;
  const leagueSnap = await getDoc(doc(db, "leagues", leagueId));

  if (!leagueSnap.exists()) throw new Error("League not found");
  if (leagueSnap.data().ownerUid !== owner)
    throw new Error("Only the owner can force results");

  await updateDoc(doc(db, "leagues", leagueId, "matches", matchId), {
    homeScore: Number(scoreA),
    awayScore: Number(scoreB),
    status: "confirmed",
  });
}


// Obtener perfil simple de usuario
export async function getUserProfile(uid) {
  try {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return { uid, ...snap.data() };
  } catch (e) {
    console.error("Error loading user profile:", e);
    return null;
  }
}


// Algoritmo round-robin doble
function generateRoundRobinDouble(teams) {
  const n = teams.length;
  if (n < 2) return [];

  // Si impar, añadimos "BYE" (descanso)
  let list = [...teams];
  let hasBye = false;

  if (n % 2 !== 0) {
    list.push({ id: "bye", name: "BYE" });
    hasBye = true;
  }

  const total = list.length;
  const rounds = total - 1;
  const half = total / 2;

  let schedule = [];

  for (let round = 0; round < rounds; round++) {
    let matches = [];

    for (let i = 0; i < half; i++) {
      const teamA = list[i];
      const teamB = list[total - 1 - i];

      if (teamA.id !== "bye" && teamB.id !== "bye") {
        matches.push({
          teamA,
          teamB
        });
      }
    }

    // Rotación
    const fixed = list[0];
    const rotated = list.slice(1);
    rotated.unshift(rotated.pop());
    list = [fixed, ...rotated];

    schedule.push(matches);
  }

  // Doble vuelta (invertimos local-visitante)
  const secondRound = schedule.map(round =>
    round.map(match => ({
      teamA: match.teamB,
      teamB: match.teamA
    }))
  );

  return [...schedule, ...secondRound];
}


// =====================================
// GENERATE SCHEDULE IN FIREBASE
// =====================================
export async function generateLeagueSchedule(leagueId) {

  return runTransaction(db, async (tx) => {

    // 1. Ver si ya hay partidos
    const matchesRef = collection(db, "leagues", leagueId, "matches");
    const matchesSnap = await getDocs(matchesRef);

    if (!matchesSnap.empty) {
      throw new Error("Schedule already generated");
    }

    // 2. Cargar equipos
    const teamsRef = collection(db, "leagues", leagueId, "teams");
    const teamSnap = await getDocs(teamsRef);

    const teams = teamSnap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    if (teams.length < 2) {
      throw new Error("At least 2 teams required");
    }

    // 3. Generar calendario
    const schedule = generateRoundRobinDouble(teams);

    // 4. Insertar los partidos
    let matchday = 1;

    for (const round of schedule) {
      for (const m of round) {
        await addDoc(matchesRef, {
          teamA: m.teamA,
          teamB: m.teamB,
          scoreA: null,
          scoreB: null,
          status: "scheduled",
          matchday,
          createdAt: serverTimestamp()
        });
      }
      matchday++;
    }
  });
}
  

// ----------------------------------------------------
//  EXPORT FIREBASE UTILITIES (optional)
// ----------------------------------------------------
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
  increment,
};
