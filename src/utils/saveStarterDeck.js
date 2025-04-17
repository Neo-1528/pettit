
// utils/saveStarterDeck.js
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const saveStarterDeck = async (uid, deckName, deckCards) => {
  if (!uid) {
    alert("ユーザーID(uid)が取得できませんでした。保存を中止します。");
    throw new Error("UID is undefined");
  }

  const newDeck = {
    name: deckName,
    cards: deckCards,
    createdAt: Date.now(),
  };

  // 🔹 users/{uid}/decks にデッキを保存
  const userDeckRef = await addDoc(collection(db, "users", uid, "decks"), newDeck);
  const newDeckId = userDeckRef.id;

  // 🔹 users/{uid} に starterSelected フラグと starterDeckId を記録
  await setDoc(doc(db, "users", uid), {
    starterSelected: true,
    starterDeckId: newDeckId,
  }, { merge: true });

  return newDeckId;
};
