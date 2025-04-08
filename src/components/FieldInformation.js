// components/FieldInformation.js

import React from "react";

const FieldInformation = ({
  turn,
  isPlayerTurn,
  playerPP,
  enemyPP,
  field,
  enemyField,
  selectedEnemyIndex,
  onSelectEnemy,
  hitIndex,
}) => {
  return (
    <div className="text-center text-sm">
      <p className="text-lg mb-4">
        ターン: {turn}（{isPlayerTurn ? "自分のターン" : "相手のターン"}）
      </p>

      <div className="flex flex-col items-center gap-10">
        {/* 敵のフィールド（上） */}
        <div className="flex flex-col items-center transform rotate-180">
          <div className="flex justify-center gap-2">
            {enemyField && enemyField.map((card, index) => (
              <div
                key={index}
                onClick={() => onSelectEnemy(index)}
                className={`transform rotate-180 border p-2 rounded w-24 shadow text-xs bg-white cursor-pointer ${
                  selectedEnemyIndex === index ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="text-[10px]">PP:{card?.PP}</div>
                <div className="font-bold text-sm">{card?.name}</div>
                {card?.image && (
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-12 object-cover my-1"
                  />
                )}
                <div className="text-green-600">HP: {card?.HP}</div>
                <div className="text-red-600">AP: {card?.AP}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-xs transform rotate-180">
            敵 PP: {enemyPP}
          </div>
        </div>

        {/* 自分のフィールド（下） */}
        <div className="flex flex-col items-center">
          <div className="flex justify-center gap-2">
            {field && field.map((card, index) => (
              <div
                key={index}
                className={`border p-2 rounded w-24 shadow text-xs bg-white ${card?.attacked ? "opacity-50" : ""}`}
              >
                <div className="text-[10px]">PP:{card?.PP}</div>
                <div className="font-bold text-sm">{card?.name}</div>
                {card?.image && (
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-12 object-cover my-1"
                  />
                )}
                <div className="text-green-600">HP: {card?.HP}</div>
                <div className="text-red-600">AP: {card?.AP}</div>
              </div>
            ))}
          </div>
          <div className="mt-2 text-center text-xs">自分 PP: {playerPP}</div>
        </div>
      </div>
    </div>
  );
};

export default FieldInformation;
