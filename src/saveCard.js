// src/saveCard.js
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const saveCardToFirestore = async (cardData, userId) => {
  try {
    await addDoc(collection(db, "cards"), {
      ...cardData,
      uid: userId,
      createdAt: serverTimestamp(),
    });
    alert("カードを保存しました！");
  } catch (error) {
    console.error("カード保存エラー:", error);
    alert("保存に失敗しました！");
  }
};
