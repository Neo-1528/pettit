
import React, { useState } from "react";
import { motion } from "framer-motion";

const BattleLayout = ({
  background = "/images/basic-field.jpg",
  playerPP,
  enemyPP,
  playerField = [],
  enemyField = [],
  hand = [],
  isPlayerTurn,
  onTurnEnd,
  onCardPlay,
  children,
}) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [drawingCard, setDrawingCard] = useState(null); 
  const [graveyard, setGraveyard] = useState([]);
  const [showGraveyard, setShowGraveyard] = useState(false);


  const sendToGraveyard = (card) => {
    setGraveyard(prev => [...prev, card]);
    setDrawingCard(card);
    setTimeout(() => setDrawingCard(null), 800);
  };

  return (
    <div
      className="relative w-full h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('${background}')` }}
    >
      {/* 敵側 UI */}
      <div className="absolute top-0 w-full flex flex-col items-center z-10">
        {/* 敵手札 */}
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-12 h-16 bg-gray-400 rounded shadow" />
          ))}
        </div>

        {/* 敵PP */}
        <div className="text-sm font-bold bg-white/80 px-4 py-1 rounded-full mt-2">
          PP: {enemyPP}
        </div>

        {/* 山札・墓地 */}
        <div className="flex justify-between w-full px-4 mt-2">
          <div className="deck-slot">
            <img src="/images/card-back.jpg" alt="山札" style={{ width: '60px', height: '84px', borderRadius: '6px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', transform: 'scaleY(-1)' }} />
          </div>
          <div className="relative w-[60px] h-[84px] bg-red-300 text-xs flex items-center justify-center rounded cursor-pointer" onClick={() => setShowGraveyard(!showGraveyard)}>
            墓地
            {showGraveyard && (
              <div className="absolute top-full mt-2 w-[140px] bg-white border shadow-lg rounded z-50 p-2">
                {graveyard.length === 0 ? (
                  <div className="text-xs text-gray-500">カードなし</div>
                ) : (
                  graveyard.map((card, index) => (
                    <div key={index} className="text-xs py-1 border-b">
                      {card.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* 敵フィールド */}
        <div className="flex justify-center gap-2 mt-4">
          {enemyField.map((card) => (
            <div
              key={card.uid}
              className="w-16 h-24 bg-white rounded shadow text-center text-xs"
            >
              {card.name}
            </div>
          ))}
        </div>
      </div>

      {/* プレイヤー側 UI */}
      <div className="absolute bottom-0 w-full flex flex-col items-center z-10 mb-4">
        {/* 自分フィールド */}
        <div className="flex justify-center gap-2 mb-4">
          {playerField.map((card) => (
            <div
              key={card.uid}
              className="w-16 h-24 bg-white rounded shadow text-center text-xs"
            >
              {card.name}
            </div>
          ))}
        </div>

        {/* 山札・墓地・PP */}
        <div className="flex justify-between w-full px-4 items-center mb-4">
          <div className="relative w-[60px] h-[84px] bg-red-300 text-xs flex items-center justify-center rounded cursor-pointer" onClick={() => setShowGraveyard(!showGraveyard)}>
            墓地
            {showGraveyard && (
              <div className="absolute bottom-full mb-2 w-[140px] bg-white border shadow-lg rounded z-50 p-2">
                {graveyard.length === 0 ? (
                  <div className="text-xs text-gray-500">カードなし</div>
                ) : (
                  graveyard.map((card, index) => (
                    <div key={index} className="text-xs py-1 border-b">
                      {card.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="text-sm font-bold bg-white/80 px-4 py-1 rounded-full">
            PP: {playerPP}
          </div>
          <img 
            src="/images/card-back.jpg"
            alt="山札"
            style={{
              width: '60px',
              height: '84px',
              borderRadius: '6px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          />
        </div>

        {/* 手札 */}
        <div className="relative h-[160px] w-full mt-2 flex justify-center items-end overflow-visible pointer-events-none">
          {hand.map((card, i) => {
            const centerIndex = Math.floor(hand.length / 2);
            const offset = i - centerIndex;
            const rotate = offset * 10;
            const translateY = Math.abs(offset) * 10;
            const z = 100 - Math.abs(offset);

            const uid = card.uid || `${card.id || card.name || "card"}-${i}`;

            return (
              <div
                key={uid}
                onClick={() => setSelectedCard(card)}
                className="w-24 h-32 bg-white rounded-lg shadow-lg border absolute pointer-events-auto transition-transform duration-200 hover:-translate-y-2 hover:z-50"
                style={{
                  transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
                  zIndex: z,
                  left: `${50 + offset * 50}px`,
                }}
              >
                <div className="text-center text-xs p-1">{card.name}</div>
              </div>
            );
          })}
        </div>

        {selectedCard && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded shadow w-64 text-center">
              <h2 className="font-bold mb-2">{selectedCard.name}</h2>
              <p>PP: {selectedCard.PP}</p>
              <p>HP: {selectedCard.HP}</p>
              <p>AP: {selectedCard.AP}</p>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => {
                    onCardPlay?.(selectedCard);
                    setSelectedCard(null);
                  }}
                >
                  使う
                </button>
                <button
                  className="bg-gray-300 px-3 py-1 rounded"
                  onClick={() => setSelectedCard(null)}
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {isPlayerTurn && onTurnEnd && (
          <button
            onClick={onTurnEnd}
            className="absolute bottom-4 right-4 z-40 bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded shadow"
          >
            ターン終了
          </button>
        )}

        {drawingCard && (
          <motion.div
            className="fixed top-[10%] right-[5%] z-50 w-24 h-32 bg-white border rounded shadow text-xs flex items-center justify-center"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: -300, y: 400, opacity: 0.8, scale: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {drawingCard.name}
          </motion.div>
        )}
      </div>

      {/* 追加要素（天気や属性など） */}
      {children}
    </div>
  );
};

export default BattleLayout;
