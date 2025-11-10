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
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
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

export async function registerEmailPassword(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(cred.user, { displayName: name });
  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    name: name || email,
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

// -------- FOROS --------

// 1) Lectura en vivo mejorada con callback de error opcional
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

// 2) Fetch inicial por si el listener falla (pinta algo ya)
export async function getForumsOnce() {
  const qy = query(collection(db, "forums"), orderBy("updatedAt", "desc"));
  const snap = await getDocs(qy);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addForum({ title, description = "", tag = "general" }) {
  const uid = auth.currentUser?.uid || null;
  const ownerName =
    auth.currentUser?.displayName || auth.currentUser?.email || "User";
  const ref = await addDoc(collection(db, "forums"), {
    title,
    description,
    tag,
    ownerUid: uid,
    ownerName,
    posts: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

// Helpers para detalle (por si los usas)
export async function getForum(forumId) {
  const ref = doc(db, "forums", forumId);
  const snap = await getDoc(ref);
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
    (err) => {
      console.error("[listenForumMessages] error:", err);
      onError?.(err);
    }
  );
}
export async function addForumMessage(forumId, text) {
  const uid = auth.currentUser?.uid;
  const name = auth.currentUser?.displayName || auth.currentUser?.email || "User";
  if (!uid) throw new Error("Please sign in first");

  await addDoc(collection(db, "forums", forumId, "messages"), {
    text, uid, name, createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, "forums", forumId), {
    posts: increment(1),
    updatedAt: serverTimestamp(),
  });
}
