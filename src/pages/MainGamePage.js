import React from "react";
import Card from "../components/Card";
import FieldInformation from "../components/FieldInformation";
import BattleLog from "../components/BattleLog";
import GameResultModal from "../components/GameResultModal";
import Login from "./Login";

const MainGamePage = ({
  user,
  selectedDeck,
  waitingForStart,
  startGame,
  mulliganCount,
  handleDeckSelection,
  handleMulligan,
  turn,
  isPlayerTurn,
  nextTurn,
  playerPP,
  enemyPP,
  deck,
  graveyard,
  hand,
  playCard,
  field,
  enemyField,
  handleAttack,
  selectedEnemyIndex,
  setSelectedEnemyIndex,
  hasAttackedThisPhase,
  setHasAttackedThisPhase,
  hitIndex,
  gameResult,
  setGameResult,
  log,
}) => {
  return (
    <>
      {!user && (
        <div className="text-center mb-4">
          <Login />
        </div>
      )}

      {user && (
        <div className="text-center text-sm text-gray-700 mb-2">
          ログイン中: {user.displayName}
        </div>
      )}


      {!selectedDeck ? (
        <div className="text-center space-y-4">
          <div className="text-lg font-bold">使いたいデッキを選んでください</div>
          <button
            onClick={() => handleDeckSelection("A")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            デッキA（バランス型）
          </button>
          <button
            onClick={() => handleDeckSelection("B")}
            className="px-4 py-2 bg-red-500 text-white rounded ml-2"
          >
            デッキB（攻撃特化型）
          </button>
        </div>
      ) : waitingForStart ? (
        <div className="text-center">
          <div className="mb-2">初期手札の確認（残り引き直し：{mulliganCount}回）</div>
          <button
            onClick={handleMulligan}
            disabled={mulliganCount <= 0}
            className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded"
          >
            引き直す
          </button>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            ゲーム開始！
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div>ターン: {turn}（{isPlayerTurn ? "自分のターン" : "相手のターン"}）</div>
            <button
              onClick={nextTurn}
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={!isPlayerTurn}
            >
              ターン終了
            </button>
          </div>

        <FieldInformation
            turn={turn}
            isPlayerTurn={isPlayerTurn}
            playerPP={playerPP}
            enemyPP={enemyPP}
            field={field}
            enemyField={enemyField}
            selectedEnemyIndex={selectedEnemyIndex}
            onSelectEnemy={setSelectedEnemyIndex}
            hitIndex={hitIndex}
        />




          <h2 className="text-center font-bold mb-2">手札</h2>
          <div className="fixed bottom-0 left-0 w-full bg-black bg-opacity-80 p-4 flex justify-center gap-2 z-50">
            {hand.map((card, index) => (
              <Card
                key={index}
                card={card}
                isInhand={true}
                onClick={() => {
                    if (isPlayerTurn && playerPP >= card.pp) {
                        playCard(card, index);
                    }
                }}
              />
            ))}
          </div>

          <BattleLog log={log} />
        </>
      )}

      <GameResultModal result={gameResult} onClose={() => setGameResult(null)} />
    </>
  );
};

export default MainGamePage;