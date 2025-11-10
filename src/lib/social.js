// src/lib/social.js
import { db, storage } from "./firebase";
import {
  collection, addDoc, serverTimestamp, query, orderBy,
  onSnapshot, doc, getDoc, setDoc, deleteDoc, where
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function addPostWithImage(user, file, caption) {
  if (!user) throw new Error("Not authenticated");
  if (!file) throw new Error("No file");
  const safeName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const path = `posts/${user.uid || "anon"}/${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);

  const docRef = await addDoc(collection(db, "posts"), {
    uid: user.uid || null,
    author: user.name || user.email || "user",
    caption: caption || "",
    imageUrl,
    createdAt: serverTimestamp()
  });
  return { id: docRef.id, imageUrl };
}

export function listenPosts(cb, onErr) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, (err) => onErr && onErr(err));
}

export async function addComment(postId, user, text) {
  if (!user) throw new Error("Not authenticated");
  const refCol = collection(db, "posts", postId, "comments");
  await addDoc(refCol, {
    uid: user.uid || null,
    author: user.name || user.email || "user",
    text: text.trim(),
    createdAt: serverTimestamp()
  });
}
export function listenComments(postId, cb) {
  const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export function listenLikes(postId, cb) {
  const likesCol = collection(db, "posts", postId, "likes");
  return onSnapshot(likesCol, (snap) => {
    const count = snap.size;
    const byUid = new Set(snap.docs.map((d) => d.id));
    cb({ count, byUid });
  });
}
export async function toggleLike(postId, user) {
  if (!user?.uid) throw new Error("Not authenticated");
  const likeRef = doc(db, "posts", postId, "likes", user.uid);
  const snap = await getDoc(likeRef);
  if (snap.exists()) {
    await deleteDoc(likeRef);
    return { liked: false };
  } else {
    await setDoc(likeRef, { uid: user.uid, createdAt: serverTimestamp() });
    return { liked: true };
  }
}

export function listenUserPosts(uid, cb) {
  const q = query(collection(db, "posts"), where("uid", "==", uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}
