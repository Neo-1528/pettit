// ✅ Firebase Firestore にプレイヤーの手札を保存する関数

import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // すでに初期化された db と auth を使う

/**
 * 対戦ルームに自分の手札を保存する
 * @param {string} roomId - Firestore 上のルームID
 * @param {Array} hand - 保存したいカードの配列
 */
export async function saveHand(roomId, hand) {
  const user = auth.currentUser;
  if (!user) throw new Error("ログインしてください");

  // どちらのプレイヤーかを判定（これは今後改善できる）
  const key = "player1Hand"; // 仮にplayer1とする（あとで動的に切替可能）

  const roomRef = doc(db, "rooms", roomId);
  await updateDoc(roomRef, {
    [key]: hand
  });
}

// 📝 使い方の例：
// const hand = [
//   { id: "火の鳥", pp: 4, hp: 5, ap: 3 },
//   { id: "スライム", pp: 2, hp: 3, ap: 1 }
// ];
// await saveHand("roomABC123", hand);

// 🔄 Firestore 上の rooms/roomABC123 に次のようなデータが保存される：
// "player1Hand": [ { id: "火の鳥", pp: 4, ... }, { ... } ]