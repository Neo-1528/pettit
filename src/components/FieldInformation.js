
// components/FieldInformation.js
import React from "react";

const FieldInformation = ({ turn, isPlayerTurn, playerPP, enemyPP }) => {
  return (
    <>
      {/* ターン表示 */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-white/80 px-4 py-1 rounded shadow text-sm">
        ターン: {turn}（{isPlayerTurn ? "あなたのターン" : "敵のターン"}）
      </div>

      {/* PP表示（上と下） */}
      <div className="absolute top-[6%] right-4 z-20 text-xs bg-white/70 px-2 py-1 rounded">
        敵 PP: {enemyPP}
      </div>
      <div className="absolute bottom-[6%] left-4 z-20 text-xs bg-white/70 px-2 py-1 rounded">
        自分 PP: {playerPP}
      </div>
    </>
  );
};

export default FieldInformation;
