

// Firebase Firestore を使ったオンライン対戦部屋システムの基本構成

import { collection, addDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebase";



// ✅ ルームを作成する関数
export async function createRoom() {
  const user = auth.currentUser;
  if (!user) throw new Error("ログインしてください");

  const roomRef = await addDoc(collection(db, "rooms"), {
    player1Id: user.uid,
    turn: 1,
    createdAt: new Date(),
  });
  return roomRef.id;
}

// ✅ 既存のルームに参加する関数
export async function joinRoom(roomId) {
  const user = auth.currentUser;
  if (!user) throw new Error("ログインしてください");

  const roomRef = doc(db, "rooms", roomId);
  await updateDoc(roomRef, {
    player2Id: user.uid
  });
}

// ✅ リアルタイムでルームの状態を監視する関数
export function subscribeToRoom(roomId, callback) {
  const roomRef = doc(db, "rooms", roomId);
  return onSnapshot(roomRef, (snapshot) => {
    callback(snapshot.data());
  });
}

// 🔁 このモジュールを React 画面から使えば、
// - createRoom() → ルームを作成して ID を取得
// - joinRoom(id) → 既存ルームに参加
// - subscribeToRoom(id, cb) → 状態をリアルタイム監視
// ができるようになります！
