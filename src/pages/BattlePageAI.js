
import React, { useState, useEffect, useRef } from "react";
import { GameLogic } from "../game/logic";
import { deckTypeA, deckTypeB } from "../data/StartDeck";
import { useLocation } from "react-router-dom";
import Card from "../components/Card";
import FieldInformation from "../components/FieldInformation";
import BattleLayout from "../components/BattleLayout";
import BattleLog from "../components/BattleLog";
import GameResultModal from "../components/GameResultModal";
import Login from "./Login";

const BattlePageAI = () => {
  const location = useLocation();
  const aiLevel = location.state?.aiLevel || "しゅわ";
  const deckData = location.state?.deckData;

  const [selectedDeck, setSelectedDeck] = useState(null);
  const [waitingForStart, setWaitingForStart] = useState(true);
  const [mulliganCount, setMulliganCount] = useState(3);
  const [hand, setHand] = useState([]);
  const [deck, setDeck] = useState([]);
  const [enemyDeck, setEnemyDeck] = useState([]);
  const [enemyHand, setEnemyHand] = useState([]);
  const [turn, setTurn] = useState(1);
  const [playerPP, setPlayerPP] = useState(50);
  const [enemyPP, setEnemyPP] = useState(50);
  const [field, setField] = useState([]);
  const [enemyField, setEnemyField] = useState([]);
  const [graveyard, setGraveyard] = useState([]);
  const [enemyGraveyard, setEnemyGraveyard] = useState([]);
  const [selectedEnemyIndex, setSelectedEnemyIndex] = useState(null);
  const [hasAttackedThisPhase, setHasAttackedThisPhase] = useState(false);
  const [hitIndex, setHitIndex] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [log, setLog] = useState([]);
  const [currentFieldBg, setCurrentFieldBg] = useState("basic-field.jpg");
  const [selectedCard, setSelectedCard] = useState(null);
  const [showlog, setShowLog] = useState(false);
  const [drawingCard, setDrawingCard] = useState(null);
  const [hasSummonedThisTurn, setHasSummonedThisTurn] = useState(false);

  const game = useRef(null);
  const deckRef = useRef(deck);
  const handRef = useRef(hand);
  const graveyardRef = useRef([]);

  useEffect(() => {
    deckRef.current = deck;
  }, [deck]);

  useEffect(() => {
    handRef.current = hand;
  }, [hand]);

  // AIターン処理（useEffect内で適切に動作させる）
  useEffect(() => {
    if (!game.current || waitingForStart) return;
    if (turn % 2 === 0) {
      setTimeout(() => {
        game.current.drawCards(1);
        game.current.enemyPlayCards();
        game.current.enemyAttack();
        setTimeout(() => {
          nextTurn();
        }, 1000);
      }, 1000);
    }
  }, [turn, waitingForStart]);

  useEffect(() => {
    if (!deckData || game.current) return;
    const instance = new GameLogic(
      {
        setDeck,
        setHand,
        setField,
        setEnemyDeck,
        setEnemyHand,
        setEnemyField,
        setGraveyard,
        setEnemyGraveyard,
        setPlayerPP,
        setEnemyPP,
        setLog,
        setTurn,
        setGameResult,
        setHasAttackedThisPhase,
        setHitIndex,
      },
      {
        getTurn: () => turn,
        getField: () => field,
        getEnemyField: () => enemyField,
        getPlayerPP: () => playerPP,
        getEnemyPP: () => enemyPP,
        getDeck: () => deckRef.current,
        getHand: () => handRef.current,
        getEnemyDeck: () => enemyDeck,
        getEnemyHand: () => enemyHand,
        getGraveyard: () => graveyardRef.current,
      },
      { aiLevel }
    );
    game.current = instance;

    const fullDeck = instance.generateDeck(30, deckData.cards);
    instance.drawInitialHand(fullDeck);
    setSelectedDeck(deckData);

    const enemyBase = Math.random() < 0.5 ? deckTypeA : deckTypeB;
    const enemyDackFull = instance.generateDeck(30, enemyBase);
    instance.drawEnemyInitialHand(enemyDackFull);

    setWaitingForStart(false);
  }, [deckData]);

  const drawCard = () => {
    if (deck.length === 0) return;
    const card = deck[0];
    setDrawingCard(card);
    setDeck((prev) => prev.slice(1));

    setTimeout(() => {
      setHand((prev) => [...prev, card]);
      setDrawingCard(null);
    }, 800);
  };

  const handleMulligan = () => {
    if (mulliganCount > 0) {
      game.current.handleMulligan(deck, mulliganCount);
      setMulliganCount(mulliganCount - 1);
    }
  };

  const handlePlayCard = (card, index) => {
    if (hasSummonedThisTurn) {
      alert("このターンはすでに召喚済みです。");
      return;
    }
    const result = game.current.playCard(card, index, field, hand, playerPP);
    if (result.success) {
      setHasSummonedThisTurn(true);
    }
  };

  const nextTurn = () => {
    const newTurn = turn + 1;
    setTurn(newTurn);
    setHasAttackedThisPhase(false);
    setHasSummonedThisTurn(false);
  
    setField(prev => prev.map(c => ({ ...c, attacked: false, canAttack: true })));
    setEnemyField(prev => prev.map(c => ({ ...c, attacked: false, canAttack: true })));
  
    if (newTurn % 2 === 1) {
      // プレイヤーターン
      game.current.drawCard();
    } else {
      // 敵ターン
      setTimeout(() => {
        game.current.enemyDrawCard();
        game.current.enemyPlayCard();
        game.current.enemyAttackPhase();
        setTimeout(() => {
          nextTurn(); // ターン継続
        }, 1000);
      }, 1000);
    }
  };
  

  return (
    <div>
      <BattleLayout
        background={`/images/${currentFieldBg}`}
        playerPP={playerPP}
        enemyPP={enemyPP}
        playerField={field}
        enemyField={enemyField}
        hand={hand}
        setField={setField}
        setHand={setHand}
        isPlayerTurn={turn % 2 === 1}
        onTurnEnd={nextTurn}
        onCardPlay={(card) => handlePlayCard(card, hand.findIndex(c => c.uid === card.uid))}
      >
        <FieldInformation
          turn={turn}
          isPlayerTurn={turn % 2 === 1}
          playerPP={playerPP}
          enemyPP={enemyPP}
          field={field}
          enemyField={enemyField}
          selectedEnemyIndex={selectedEnemyIndex}
          onSelectEnemy={setSelectedEnemyIndex}
          hitIndex={hitIndex}
        />
      </BattleLayout>

      <button
        onClick={() => setShowLog(true)}
        className="fixed top-1/2 right-2 transform -translate-y-1/2 z-40 bg-white/90 border rounded-full p-2 shadow hover:bg-yellow-100"
      >
        📜
      </button>
      {showlog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white w-96 max-h-[70vh] overflow-y-auto p-4 rounded shadow relative">
            <BattleLog log={log} />
            <button
              onClick={() => setShowLog(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <GameResultModal result={gameResult} onClose={() => setGameResult(null)} />
    </div>
  );
};

export default BattlePageAI;
