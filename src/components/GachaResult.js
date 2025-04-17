
// components/GachaResult.jsx

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
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
  N: "bg-gray-800 border-dray-400",
  R: "bg-blue-800 border-blue-400",
  SR: "bg-yellow-800 border-yellow-400",
  SSR: "bg-purple-800 border-purple-400 animate-pulse",
  UR: "bg-black border-pink-400 shadow-lg animate-pluse"
};

const rarityTextColors = {
  N: "text-gray-300",
  R: "text-blue-300",
  SR: "text-yellow-300",
  SSR: "text-purple-300",
  UR: "text-pink-400"
};

const GachaResult = ({ result, onClose }) => {
  useEffect(() => {
    if (result) {
      saveCardToOwned(result);
    }
  }, [result]);

  const saveCardToOwned = async (card) => {
    const user = getAuth().currentUser;
    if (!user || !user.uid || !card?.id) return;

    const ref = collection(db, 'users', user.uid, 'ownedCards');

    const detailedCard = cards.find((c) => c.id === card.id) || card;

    try {
      await addDoc(ref, {
        id: detailedCard.id,
        name: detailedCard.name,
        pp: detailedCard.pp,
        hp: detailedCard.hp,
        ap: detailedCard.ap,
        rarity: detailedCard.rarity,
        abilities: detailedCard.abilities || [],
        flavor: detailedCard.flavor || "",
        imageSrc: detailedCard.image || "/images/default.jpg",
        obtainedAt: new Date().toISOString()
      });
      console.log("保存完了:", detailedCard.name);
    } catch (e) {
      console.error("保存失敗:", e);
    }
  };

  if (!result) return null;

  const rarity = result.rarity || "N";
  const rarityClass = rarityClasses[rarity];

  const detailedCard = cards.find((card) => card.id === result.id);

  const finalCard = detailedCard || {
    name: result.name,
    pp: result.pp,
    hp: result.hp,
    ap: result.ap,
    rarity: result.rarity,
    abilities: [],
    flavor: "",
    imageSrc: "/assets/cards/default.jpg",
  };

  const nameColor = rarityTextColors[finalCard.rarity || "N"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <motion.div
        className="bg-white p-6 rounded-xl shadow-xl text-center w-72"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <h2 className="text-xl font-bold mb-2">✨召喚されたプチ✨</h2>
        <CardComponent {...finalCard} />
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-black rounded hover:bg-blue-600"
          onClick={onClose}
        >
          閉じる
        </button>
      </motion.div>
    </div>
  );
};

export default GachaResult;
