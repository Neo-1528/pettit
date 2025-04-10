

// components/StarterDeckSelector.js
import React from "react";
import { saveStarterDeck } from "../utils/saveStarterDeck";
import { deckTypeA, deckTypeB } from "../cardData";
import { useNavigate } from "react-router-dom";

const StarterDeckSelector = ({ uid }) => {
  const navigate = useNavigate();

  const handleSelect = async (type) => {
    const deckId = type === "A" ? "A" : "B";
    const deck = type === "A" ? deckTypeA : deckTypeB;

    await saveStarterDeck(uid, deckId, deck);
    alert("スターターデッキを選択しました！");
  };

  return (
    <div className="text-center p-4">
      <h2 className="text-xl font-bold mb-4">スターターデッキを選んでください</h2>
      <div className="flex justify-center gap-4">
        <button onClick={() => handleSelect("A")} className="px-4 py-2 bg-blue-500 text-white rounded">
          デッキA（バランス型）
        </button>
        <button onClick={() => handleSelect("B")} className="px-4 py-2 bg-red-500 text-white rounded">
          デッキB（攻撃型）
        </button>
      </div>
    </div>
  );
};

export default StarterDeckSelector;
