

// utils/saveStarterDeck.js
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const saveStarterDeck = async (uid, deckId, cards) => {
  const cardIds = cards.map((card) => card.id); // IDだけ保存（またはそのままカード全部でもOK）

  await setDoc(doc(db, "users", uid), {
    starterDeck: deckId,
    ownedCards: cardIds,
    deck: cardIds,
  }, { merge: true }); // 既存のユーザーデータにマージ
};
