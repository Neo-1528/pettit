
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BattleLayout({
  hand,
  field,
  enemyField,
  pp,
  enemyPP,
  turn,
  isPlayerTurn,
  attackerIndex,
  setAttackerIndex,
  hasAttacked,
  onPlayCard,
  onTurnEnd,
  onAttack,
  turnLabel,
  isDrawing,
  playerGraveyard,
  enemyGraveyard,
  showGraveyard,
  setShowGraveyard
}) {

  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [previewCard, setPreviewCard] = useState(null);
  const [pressTimer, setPressTimer] = useState(null);
  const [phaseMessage, setPhaseMessage] = useState(null);
  const [prevPhase, setPrevPhase] = useState(1);

  const phaseLabel = turn <= 6 ? "フェーズ1" : turn <= 20 ? "フェーズ2" : "フェーズ3";

  useEffect(() => {
    const currentPhase = turn <= 6 ? 1 :turn <= 20 ? 2 : 3;
    if (currentPhase !== prevPhase) {
      setPhaseMessage(`フェーズ${currentPhase}に突入！`);
      setPrevPhase(currentPhase);
      setTimeout(() => setPhaseMessage(null), 3000);
    }
  }, [turn]);

  return (
    <div
      className="w-full h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: "url('/images/basic-field.jpg')" }}
    >
      

    <AnimatePresence>
            {turnLabel && (
              <motion.div
              key={turnLabel}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.6 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                        bg-black bg-opacity-70 px-4 py-2  
                        rounded-xl z-50 shadow-lg text-white 
                        text-lg sm:text-3xl font-bold text-center w-[70vw] max-w-xs break-wards"
              >
                {turnLabel}
              </motion.div>  
            )}
    </AnimatePresence>

    <AnimatePresence>
      {phaseMessage && (
        <motion.div
          key={phaseMessage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6 }}
          className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 px-8 py-4 rounded-2xl shadow-2xl text-white text-3xl font-extrabold tracking-widest z-50 animate-pulse"
        >
          {phaseMessage}
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
            {isDrawing && (
              <motion.img
                src="/images/card-back.jpg"
                alt="ドロー中カード"
                initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                animate={{ x: -100, y: 200, opacity: 0, scale: 0.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute z-40 w-20 h-28 rounded"
                style={{ top: "75%", left: "80%", transform: "translate(-50%, -50%)" }} // 山札の位置に応じて調整
              />
            )}
    </AnimatePresence>
      
    

    <AnimatePresence>
      {showGraveyard && (
        <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration:0.3 }}
        className="fixed bottom-20 left-4 bg-white border rounded p-4 shadow-lg z-50 w-64 max-h-[50vh] overflow-y-auto"
        >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold">
            {showGraveyard === "player" ? "自分の墓地" : "敵の墓地"}カード一覧
          </h3>
          <button onClick={() => setShowGraveyard(null)} className="text-sm text-gray-500 hover:text-black">閉じる</button>
        </div>
        <ul className="text-sm space-y-1">
          {(showGraveyard === "player" ? playerGraveyard : enemyGraveyard).map((card, i) => (
            <li key={i} className="border-b py-1">
              {card.name} (HP:{card.hp} / AP:{card.ap} / PP:{card.pp})
            </li>
          ))}
        </ul>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="absolute top-4 left-4 bg-white bg-opacity-80 px-3 py-1 rounded shadow-md text-sm font-bold z-50">
      {phaseLabel}
    </div>


    {previewCard && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={() => setPreviewCard(null)}>
        <div className="bg-white rounded-lg p-4 shadow-lg max-w-sm w-full relative" onClick={(e) => e.stopPropagation()}>
          <img 
            src={previewCard.imagSrc || `/images/cards/${previewCard.image}`}
            alt={previewCard.name}
            className="w-full h-auto rounded"
          />
          <h3 className="text-lg font-bold mt-2">{previewCard.name}</h3>
          <p className="text-sm">HP: {previewCard.hp} / AP: {previewCard.ap} / PP: {previewCard.pp}</p>
          {previewCard.abilities && (
            <ul className="mt-2 text-sm list-dist list-inside">
              {previewCard.abilities.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          )}
        </div>
      </div>
    )}






      <div className="flex flex-col justify-between h-full">
        {/* === 敵側 === */}
        <div className="flex flex-col items-center space-y-2">
          {/* 敵手札（裏面） */}
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src="/images/card-back.jpg"
                alt="カード裏"
                className="w-16 h-24 rounded shadow-md"
              />
            ))}
          </div>

          {/* 敵ステータス行 */}
          <div className="flex justify-center space-x-8 items-center">
            <img
              src="/images/card-back.jpg"
              alt="山札"
              className="absolute w-20 h-28 rounded shadow-md hover:-translate-y-1"
              style={{ top: "20%", left: "20%", transform: "translate(-50%, -50%)"}}
            />
            <div className="relative w-16 h-16">
            <img src="/images/ui/pp-bottle.png" alt="PP瓶" className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold drop-shadow-md">
              {enemyPP}
            </div>
            </div>

            <div
              onClick={() => setShowGraveyard("enemy")}
              className="relative w-20 h-20 cursor-pointer z-10"
            >
              <img src="/images/ui/cemetery.png" alt="墓地" className="w-full h-full object-contain" />
              <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
                {enemyGraveyard.length}
              </div>
            </div>
          </div>



          {/* 敵フィールド */}
          <div className="flex justify-center space-x-4 mt-32">
            {enemyField.map((card, i) => (
              <div
                key={i}
                onClick={() => {
                  if (isPlayerTurn && attackerIndex !== null) {
                    onAttack(attackerIndex, i);
                    setAttackerIndex(null);
                  }
                }}
                className="w-20 h-28 bg-red-100 cursor-pointer hover:bg-red-200 flex flex-col justify-between items-center p-1 relative"
              >
                <img
                 src={`/images/characters/${card.name}`}
                 alt={card.name}
                 className="w-full h-full object-cover rounded shadow-md"
                />
                <div className="absolute top-0 left-0 text-[10px] bg-purple-400 text-black px-1 rounded-br">
                  {card.pp}
                </div>
                <div className="absolute bottom-0 left-0 text-[10px] bg-green-500 text-white px-1 rounded-tr">
                  {card.hp}
                </div>
                <div className="absolute bottom-0 right-0 text-[10px] bg-red-500 text-white px-1 rounded-tl">
                  {card.ap}
                </div>
              </div>
            ))}
          </div>
        </div>

      


        {/* === 自分側 === */}
        <div className="flex flex-col items-center space-y-2">
          {/* 自分フィールド */}
          <div className="flex justify-center space-x-4">
            {field.map((card, i) => (
              <div
                key={i}
                onClick={() => isPlayerTurn && setAttackerIndex(i)}
                className={`w-20 h-28 cursor-pointer flex flex-col justify-between items-center relative ${
                  attackerIndex === i ? 'bg-yellow-200' : 'bg-blue-100'
                }`}
              >
                <img
                 src={`/images/characters/${card.image}`}
                 alt={card.name}
                 className="w-full h-full object-cover rounded shadow-md"
                />
                <div className="absolute top-0 left-0 text-[10px] bg-purple-400 text-black px-1 rounded-br">
                  {card.pp}
                </div>
                <div className="absolute bottom-0 left-0 text-[10px] bg-green-500 text-white px-1 rounded-tr">
                  {card.hp}
                </div>
                <div className="absolute bottom-0 right-0 text-[10px] bg-red-500 text-white px-1 rounded-tl">
                  {card.ap}
                </div>

                 {!card.canAttackNextTurn && (
                  <div className="text-[10px] text-gray-500 font-semibold">🕒 出撃直後</div>
                )}
                {hasAttacked && (
                  <div className="text-[10px] text-red-600 font-semibold">⚔️ 攻撃済</div>
                )}
              </div>
            ))}
          </div>

          {/* 自分ステータス行 */}
          <div className="flex justify-center space-x-8 items-center">
            <div
              onClick={() => setShowGraveyard("player")}
              className="relative w-20 h-20 cursor-pointer z-10"
            >
              <img 
                src="/images/ui/cemetery.png"
                alt="墓地"
                className="w-full h-full object-contain"
              />
              <div className="absoluet -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow">
                {playerGraveyard.length}
              </div>
            </div>  

          
          <div className="relative w-16 h-16">
            <img src="/images/ui/pp-bottle.png" alt="PP瓶" className="w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold drop-shadow-md">
              {pp}
            </div>
          </div>


            <img
              src="/images/card-back.jpg"
              alt="山札"
              className="absolute w-20 h-28 rounded shadow-md hover:-translate-y-1"
              style={{ top: "80%", left: "80%", transform: "translate(-50%, -50%)"}}
            />
          </div>



          {/* 手札表示 */}
          <div className="relative h-40 flex justify-center items-end mt-2">
            {hand.map((card, i) => {
              const offset = (i - (hand.length / 1) / 2) * 8; // 回転角度
              return (
                <button
                  key={i}
                  onClick={() => isPlayerTurn && setSelectedCardIndex(i)}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onMouseDown={() => {
                    const timer = setTimeout(() => setPreviewCard(card), 500);
                    setPressTimer(timer);
                  }}
                  onMouseUp={() => clearTimeout(pressTimer)}
                  disabled={!isPlayerTurn}
                  className="absolute bottom-0 transition-all duration-300 ease-in-out"
                  style={{
                    transform: `rotate(${offset}deg) translateY(${Math.abs(offset) * 0.5}px) translateX(${offset * 2}px)`,
                    zIndex: hoveredCard === i ? 9999 : hand.length - i,
                  }}
                >
                  <div className="w-24 h-32 relative overflow-hidden rounded-xl shadow-lg hover:z-50 hover:scale-125 hover:rotate-0 transition">
                    <img
                      src={
                        card.imageSrc
                        ? card.imageSrc
                        : `/images/cards/${card.image}`
                      }
                      alt={card.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {selectedCardIndex !== null && (
            <div className="mt-2 flex justify-center space-x-4 z-50">
              <button
                onClick={() => {
                  onPlayCard(selectedCardIndex);
                  setSelectedCardIndex(null);
                }}
                className="px-4 py-1 bg-green-600 text-white rounded shadow hover:bg-gray-500"
                >
                  出撃する
                </button>
                <button 
                  onClick={() => setSelectedCardIndex(null)}
                  className="px-4 py-1 bg-gray-400 text-white rounded shadow hover:bg-gray-500"
                  >
                    キャンセル
                  </button>
                </div>
          )}

            {selectedItemCard && (
              <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col items-center justify-center z-50">
                <p className="text-white text-xl mb-4">
                  「{selectedItemCard.name}」を使用する対象を選んでください
                </p>
                <button
                  className="bg-white text-black px-4 py-2 rounded"
                  onClick={() => setSelectedItemCard(null)}
                >
                  キャンセル
                </button>
              </div>
            )}


          
          <div className="text-center mt-2">
          {isPlayerTurn && (
            <button
            onClick={onTurnEnd}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50"
            >
            <div
              className="w-32 h-12 bg-cover bg-center flex items-center justify-center text-white font-bold text-sm shadow-lg hover:scale-105 transition"
              style={{ backgroundImage: "url('/images/ui/turnfinish.png')" }}
            >
              ターン終了
            </div>
          </button>
        
          )}

          </div>
        </div>
      </div>
    </div>
  );
}
