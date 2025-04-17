
import React, { useEffect, useState } from 'react';
import { getDecks, createDeck, deleteDeck } from '../firebase/deck';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';
import DeckCard from '../components/DeckCard';

const DeckListPage = () => {
  const [decks, setDecks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllDecks = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const deckList = await getDecks(user.uid);
      setDecks(deckList);

    };

    fetchAllDecks();
  }, []);

  const handleCreate = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (decks.length >= 7) {
      alert("デッキは7つまでしか作成できません");
      return;
  }

  const newDeckId = await createDeck(user.uid);
  navigate(`/deck/edit/${newDeckId}`);
  };

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    if (window.confirm("このデッキを削除しますか？")) {
      await deleteDeck(user.uid, id);
      const updated = await getDecks(user.uid);
      setDecks(updated);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdf6e3] p-8 font-sans text-brown-900">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center border-b-2 border-yellow-300 pb-2">
          あなたのデッキ（{decks.length}/7）
        </h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleCreate}
            className="bg-yellow-200 hover:bg-yellow-300 text-brown-800 font-bold py-2 px-6 rounded-full shadow transition"
          >
            ＋ 新しいデッキを作る
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white border-2 border-yellow-300 rounded-2xl shadow-md p-4 text-center"
            >
              <h3 className="text-xl font-semibold text-brown-800 mb-2">{deck.name || "（名称未設定）"}</h3>
              <p className="text-sm text-brown-600 mb-4">カード数：{deck.cards?.length || 0}枚</p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => navigate(`/deck/edit/${deck.id}`)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm px-4 py-1 rounded-full"
                >
                  編集
                </button>
                <button
                  onClick={() => handleDelete(deck.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 text-sm px-4 py-1 rounded-full"
                >
                  🗑 削除
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeckListPage;
