
// src/pages/DeckSelectPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";

const DeckSelectPage = ({user}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const aiLevel = location.state?.aiLevel || "しゅわ";

  const [decks, setDecks] = useState([]);
  
  useEffect(() => {
    if (!user) return;
    const fetchDecks = async () => {
        try {
          const q = collection(db, "users", user.uid, "decks");
        const snapshot = await getDocs(q);
        const deckList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));
        console.log("取得したデッキ一覧:", deckList);
        setDecks(deckList);
    } catch (error) {
        console.error("デッキの取得に失敗:", error);
    }
};
    fetchDecks();
  }, [user]);

  const handleDeckChoice = (deck) => {
    navigate("/mulligan", {
      state: { aiLevel, deckData: deck },
    });
  };

  return (
    <div className="text-center p-4">
      <h1 className="text-2xl font-bold mb-4">所持デッキを選んでください</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {decks.map((deck) => (
            <button
                key={deck.id}
                className="bg-blue-600 text-white px-4 py-3 rounded"
                onClick={() => handleDeckChoice(deck)}
            >
                {deck.name || "デッキ"}
            </button>
        ))}
      </div>
    </div>
  );
};

export default DeckSelectPage;
