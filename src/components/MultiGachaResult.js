
// components/MultiGachaResult.jsx
import React from "react";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import cards from "../data/cards";
import CardComponent from "./CardComponent";



const rarityLabels = {
  N: "あわ",
  R: "しゅわ",
  SR: "ぷく",
  SSR: "ばぶ",
  UR: "まぼろし"
};

const rarityClasses = {
  N: "bg-gray-800 border-gray-400",
  R: "bg-blue-800 border-blue-400",
  SR: "bg-yellow-800 border-yellow-400",
  SSR: "bg-purple-800 border-purple-400 animate-pulse",
  UR: "bg-black border-pink-400 shadow-lg animate-pulse"
};

const rarityTextColors = {
  N: "text-gray-600",
  R: "text-blue-600",
  SR: "text-yellow-600",
  SSR: "text-purple-600",
  UR: "text-pink-600"
};

const MultiGachaResult = ({ results, onClose }) => {
  useEffect(() => {
    results.forEach(result => {
      const card = getCardDetail(result);
      saveCardToOwned(card);
    });
  }, [results]);

  if (!results || results.length === 0) return null;

  const getCardDetail = (result) => {
    const detailedCard = cards.find(card => card.id === result.id);
    return detailedCard || {
      name: result.name,
      pp: result.pp,
      hp: result.hp,
      ap: result.ap,
      rarity: result.rarity,
      abilities: [],
      flavor: "",
      imageSrc: "/images/default.jpg",
    };
  };

  const saveCardToOwned = async (card) => {
    const user = getAuth().currentUser;
    if (!user || !user.uid || !card?.id) {
      console.warn("ユーザー情報またはカード情報が不足している")
      return;
    } 

    const ref = collection(db, 'users', user.uid, 'ownedCards');
    
    try {
      await addDoc(ref, {
        id: card.id,
        name: card.name,
        pp: card.pp,
        hp: card.hp,
        ap: card.ap,
        rarity: card.rarity,
        abilities: card.abilities,
        flavor: card.flavor,
        imageSrc: card.imageSrc || "/images/default.jpg",
        obtaindAt: new Date().toISOString()
      });
      console.log("カードが保存されました:", card.name);
    } catch (error) {
      console.error("カードの保存に失敗しました:", error);
    } 
  };

  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <motion.div
        className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-4xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <h2 className="text-xl font-bold text-center mb-4">🎊 召喚されたプチたち 🎊</h2>

        <div className="grid grid-cols-2 gap-4 max-h-[480px] overflow-y-auto">
          {results.map((result, idx) => {
            const card = getCardDetail(result);
            const nameColor = rarityTextColors[card.rarity || "N"] || "text-black";
            return (
              <div key={idx} className="flex flex-col items-center">
                <CardComponent {...card} imageSrc={card.image} />
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
          >
            閉じる
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MultiGachaResult;
