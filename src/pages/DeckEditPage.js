
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseConfig';

const DeckEditPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deck, setDeck] = useState(null);

  useEffect(() => {
    const fetchDeck = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const docRef =doc(db, "users", uid, "decks", deckId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDeck({ id: deckId, ...docSnap.data() });
      } else {
        alert("デッキが見つかりませんでした");
        navigate('/deck');
      }
    };

    fetchDeck();
  }, [deckId, navigate]);

  const handleSave = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid || !deck) return;

      const docRef = doc(db, "users", uid, "decks", deck.id);
      await updateDoc(docRef, {
        cards: deck.cards,
      });

      alert("デッキを保存しました！");
      navigate('/deck');
    };

  const handleCardChange = (index, updatedCard) => {
    const updatedCards = [...deck.cards];
    updatedCards[index] = updatedCard;
    setDeck({ ...deck, cards: updatedCards });
  };

  if (!deck) {
    return <p className="text-center text-gray-500 mt-10">デッキを読み込み中...</p>;
  }

  return (
    <div className="min-h-screen bg-[#fdf6e3] p-8 font-sans text-brown-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center border-b-2 border-yellow-300 pb-2">
          デッキ編集: {deck.name || "名称未設定"}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {deck.cards.map((card, index) => (
            <div
              key={index}
              className="bg-white border border-yellow-300 rounded-xl shadow p-4"
            >
              <input
                type="text"
                value={card.name}
                onChange={(e) =>
                  handleCardChange(index, { ...card, name: e.target.value })
                }
                className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded"
              />
              <input
                type="number"
                value={card.pp}
                onChange={(e) =>
                  handleCardChange(index, { ...card, pp: parseInt(e.target.value) })
                }
                className="block w-full mb-2 px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full shadow-lg transition"
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeckEditPage;
