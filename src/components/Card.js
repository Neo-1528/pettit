import React from "react";

const rarityToStars = {
    N: "☆",
    R: "☆☆",
    SR: "☆☆☆",
    SSR: "☆☆☆☆",
    UR: "☆☆☆☆☆",
};

export default function Card({ card, onClick, isInhand = false }) {
  return (
    <div
      className={`flex-shrink-0 ${isInhand ? 'w-20 h-[150px]' : 'w-48 h=[320px]'}
        bg-gradient-to-br from-yellow-300 via-white to-yellow-100
        border-4 border-yellow-500 rounded-2xl shadow-2xl p-3 relative
        hover:scale-105 transform transition duration-300
        text-[10px]
        ${card.rareEffect ? 'animate-rare' : ''}`}
      onClick={onClick}
    >

        {/* レアリティバッジ */}
        {card.rarity && (
            <div
                className="absolute bottom-1 right-1 text-[12px] bg-yellow-400 text-white font-bold px-2 py-0.5 rounded-full shadow "
            >
                {rarityToStars[card.rarity] || ""}
            </div>
        )}

    
      {/* 上部：PP・名前 */}
      <div className="flex justify-between items-center text-xs font-bold mb-1">
        <div className="bg-yellow-300 text-black px-2 py-0.5 rounded-full">PP:{card.pp}</div>
        <div className="text-center text-sm flex-1">{card.name}</div>
      </div>

      {/* カード画像 */}
      <img
        src={card.image || 'card-back.png'}
        alt={card.name}
        className="w-full h-36 object-contain mb-2 rounded border border-gray-400 bg-white"
      />

      {/* HP・AP */}
      <div className="flex justify-between px-1 mb-1 text-xs font-bold">
        <div className="text-green-600">HP: {card.hp}</div>
        <div className="text-red-600">AP: {card.ap}</div>
      </div>

      {/* アビリティ */}
      {card.ability && (
        <div className="text-[10px] text-gray-700 mt-1">
          🌀 {card.ability.name}
        </div>
      )}
    </div>
  );
}
