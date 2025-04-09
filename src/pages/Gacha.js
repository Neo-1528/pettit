
// Gacha.js
import React, { useState } from "react";
import { initialCards } from "../gachadata/cards"; // カードデータを使っている想定

const Gacha = () => {
  const [petitCoins, setPetitCoins] = useState(100); // 所持プチコイン
  const [gachaResult, setGachaResult] = useState(null);

  const pullGacha = () => {
    if (petitCoins < 5) {
      alert("プチコインが足りません！");
      return;
    }

    const randomCard = initialCards[Math.floor(Math.random() * initialCards.length)];
    setGachaResult(randomCard);
    setPetitCoins(prev => prev - 5);
    setOwnedCards(prev => [...prev, randomCard]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-50 text-center p-4">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">🎁 ガチャ画面</h1>
      <p className="text-gray-600 mb-2">所持プチコイン：{petitCoins}枚</p>

      <button
        onClick={pullGacha}
        className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded mb-6"
      >
        ガチャを引く（5プチコイン）
      </button>

      {gachaResult && (
        <div className="bg-white p-4 rounded shadow-md w-64">
          <h2 className="text-xl font-bold mb-2">✨ ガチャ結果 ✨</h2>
          <img
            src={gachaResult.image}
            alt={gachaResult.name}
            className="w-full h-32 object-contain mb-2"
          />
          <div className="font-semibold">{gachaResult.name}</div>
          <div>PP: {gachaResult.pp} / HP: {gachaResult.hp} / AP: {gachaResult.ap}</div>
        </div>
      )}
    </div>
  );
};

export default Gacha;
