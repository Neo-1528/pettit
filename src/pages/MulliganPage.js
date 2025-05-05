
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MulliganPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const baseDeck = location.state?.deckData?.cards || [];

  const [deck, setDeck] = useState([...baseDeck]);
  const [hand, setHand] = useState([]);
  const [rerollCount, setRerollCount] = useState(0);

  // PP3以下が最低1枚含まれるように5枚を選ぶ関数
  const drawInitialHand = (deckList) => {
    let newHand = [];
    let retries = 0;
    while (retries < 10) {
      const shuffled = [...deckList].sort(() => 0.5 - Math.random());
      newHand = shuffled.slice(0, 5);
      if (newHand.some(card => card.pp <= 3)) break;
      retries++;
    }
    return newHand;
  };

  useEffect(() => {
    setHand(drawInitialHand(deck));
  }, []);

  const handleReroll = () => {
    if (rerollCount >= 3) return;
    setHand(drawInitialHand(deck));
    setRerollCount(prev => prev + 1);
  };

  const handleConfirm = () => {
    const remainingDeck = deck.filter(c => !hand.includes(c));
    navigate("/battle-ai", {
      state: {
        deckData: {
          cards: remainingDeck,
          hand: hand
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fef9f4] text-center p-4">
      <h1 className="text-xl font-bold mb-2">初期手札を確認してください</h1>
      <p className="mb-4 text-sm">あと {3 - rerollCount} 回引き直せます</p>

      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {hand.map((card, i) => (
          <div key={i} className="w-24 h-32 relative rounded overflow-hidden shadow">
            <img
              src={card.imageSrc || `/images/cards/${card.image}`}
              alt={card.name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="space-x-4">
        <button
          onClick={handleReroll}
          disabled={rerollCount >= 3}
          className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
        >
          引き直す
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          この手札で開始！
        </button>
      </div>
    </div>
  );
}
