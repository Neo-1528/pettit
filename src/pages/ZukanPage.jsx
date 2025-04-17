
// src/pages/ZukanPage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import ZukanCard from "../components/ZukanCard";

const ZukanPage = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const uid = user.uid;
      const allCardsSnap = await getDocs(collection(db, "allCards"));
      const ownedCardsSnap = await getDocs(collection(db, "users", uid, "ownedCards"));

      const allCards = allCardsSnap.docs.map(doc => doc.data());
      const ownedIds = new Set(ownedCardsSnap.docs.map(doc => doc.data().id));

      const rarityOrder = { "まぼろし": 0, "ばぶ": 1, "ぷく": 2, "しゅわ": 3, "あわ": 4 };
      const sortedCards = allCards.sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]);

      const zukanList = sortedCards.map(card => ({
        ...card,
        owned: ownedIds.has(card.id)
      }));

      setCards(zukanList);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>図鑑</h2>
      <div className="zukan-grid">
        {cards.map((card) => (
          <ZukanCard key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
};

export default ZukanPage;
