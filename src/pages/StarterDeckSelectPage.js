
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { saveStarterDeck } from '../utils/saveStarterDeck';
import { deckTypeA, deckTypeB } from '../data/StartDeck';

const StarterDeckSelectPage = () => {
  const navigate = useNavigate();

  const handleSelect = async (type) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return alert("ログインが必要です");

    const selectedDeck = type === 'A' ? deckTypeA : deckTypeB;
    const deckName = type === 'A' ? "スターターデッキA" : "スターターデッキB";

    const newDeckId = await saveStarterDeck(uid, deckName, selectedDeck);
    navigate(`/deck/edit/${newDeckId}`);
  };

  return (
    <div className="min-h-screen bg-[#fef9f3] text-gray-800 p-6 font-sans">
      <h1 className="text-3xl font-bold text-center mb-8">スターターデッキを選んでください</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="border border-yellow-400 p-4 rounded-xl shadow bg-white">
          <h2 className="text-xl font-bold text-center mb-2">スターターデッキA</h2>
          <ul className="text-sm mb-4 list-disc list-inside">
            {deckTypeA.slice(0, 5).map((card, idx) => (
              <li key={idx}>{card.name} (PP{card.pp})</li>
            ))}
            <li className="text-gray-400">...他 {deckTypeA.length - 5} 枚</li>
          </ul>
          <button
            onClick={() => handleSelect('A')}
            className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-500 transition"
          >
            このデッキで始める
          </button>
        </div>

        <div className="border border-blue-400 p-4 rounded-xl shadow bg-white">
          <h2 className="text-xl font-bold text-center mb-2">スターターデッキB</h2>
          <ul className="text-sm mb-4 list-disc list-inside">
            {deckTypeB.slice(0, 5).map((card, idx) => (
              <li key={idx}>{card.name} (PP{card.pp})</li>
            ))}
            <li className="text-gray-400">...他 {deckTypeB.length - 5} 枚</li>
          </ul>
          <button
            onClick={() => handleSelect('B')}
            className="w-full bg-blue-400 text-white py-2 rounded hover:bg-blue-500 transition"
          >
            このデッキで始める
          </button>
        </div>
      </div>
    </div>
  );
};

export default StarterDeckSelectPage;
