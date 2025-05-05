
import React, { useState, useEffect, useRef, use } from "react";
import { useLocation } from "react-router-dom";
import { GameLogic } from "../game/GameLogic";
import BattleLayout from "../components/BattleLayout";
import GameResultModal from "../components/GameResultModal";


function BattlePage() {
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [field, setField] = useState([]);
  const [enemyField, setEnemyField] = useState([]);
  const [pp, setPP] = useState(50);
  const [enemyPP, setEnemyPP] = useState(50);
  const [turn, setTurn] = useState(1);
  const [attackerIndex, setAttackerIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [hasAttacked, setHasAttacked] = useState(false); //攻撃済みか
  const [turnLabel, setTurnLabel] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [justDrewCard, setJustDrewCard] = useState(false);
  const [playerGraveyard, setPlayerGraveyard] = useState([]);
  const [enemyGraveyard, setEnemyGraveyard] = useState([]);
  const [showGraveyard, setShowGraveyard] = useState(false);
  const [selectedItemCard, setSelectedItemCard] = useState(null);

  const game = useRef(null); //インスタンス保持

  const location = useLocation();
  const deckData = location.state.deckData; //デッキ情報を取得
  const isPlayerTurn = turn % 2 === 1;

  const stateRef = useRef({
    deck,
    hand,
    field,
    enemyField,
    pp,
    enemyPP,
    turn
  });

  useEffect(() => { stateRef.current.hand = hand; }, [hand]);
  useEffect(() => { stateRef.current.field = field; }, [field]);
  useEffect(() => { stateRef.current.deck = deck; }, [deck]);
  useEffect(() => { stateRef.current.enemyField = enemyField; }, [enemyField]);
  useEffect(() => { stateRef.current.pp = pp; }, [pp]);
  useEffect(() => { stateRef.current.enemyPP = enemyPP; }, [enemyPP]);
  useEffect(() => { stateRef.current.turn = turn; }, [turn]);

  useEffect (() => {
    if (turn % 2 === 1) {
      setTurnLabel("あなたのターン！");
    } else {
      setTurnLabel("敵のターン！");
    }

    const timer = setTimeout(() => setTurnLabel(null), 1500);
    return () => clearTimeout(timer);
  }, [turn]);

  useEffect(() => {
    if (justDrewCard) {
      setIsDrawing(true);
      setTimeout(() => {
        setIsDrawing(false);
        setJustDrewCard(false);
      }, 800);
    }
  }, [justDrewCard]);


  useEffect(() => {
    if (!deckData) return;
    const instance = new GameLogic(
      { setDeck, setHand, setField, setEnemyField, setPP, setEnemyPP, setTurn, setResult, setPlayerGraveyard, setEnemyGraveyard },
      {
         getDeck: () => stateRef.current.deck,
         getHand: () => stateRef.current.hand, 
         getField: () => stateRef.current.field, 
         getEnemyField: () => stateRef.current.enemyField, 
         getPP: () => stateRef.current.pp, 
         getEnemyPP: () => stateRef.current.enemyPP,
         getTurn: () => stateRef.current.turn 
      }
    );
    instance.setOnDraw(() => setJustDrewCard(true));
    game.current = instance;

    const fullDeck =[...deckData.cards];
    const initialHand = deckData.hand || [];
    const remainingDeck = fullDeck.filter(c => !initialHand.includes(c));

    instance.setDeck(remainingDeck);
    instance.setHand(initialHand);
    instance.setField([]);
    instance.setPP(50);
    instance.setTurn(1);

    setEnemyField([]);
  }, [deckData]);

  const handlePlayCard = (index) => { // カードをプレイする関数
    const card = hand[index];
    if (card.type === "item") {
      setSelectedItemCard({ ...card, index });
      return;
    }
    game.current.playCard(index);
  };

  const handleCharacterClick = (charIndex) => {
    if (selectedItemCard) {
      game.current.useItemCardOnTarget(selectedItemCard, charIndex);
      const newHand = [...hand];
      newHand.splice(selectedItemCard.index, 1);
      setHand(newHand);
      setSelectedItemCard(null);
    }
  };
  

  const handleAttack = (attackerIndex, targetIndex) => { // 攻撃処理
    if (!game.current || hasAttacked) return;

    const attackerCard = field[attackerIndex];
    if (!attackerCard?.canAttackNextTurn) return;

    game.current.attack(attackerIndex, targetIndex);
    setHasAttacked(true); 
    setAttackerIndex(null); 
  };

  const handleEndTurn = () => { // ターン終了処理
    if (!game.current) return;
    game.current.endTurn();
    setHasAttacked(false);
    setAttackerIndex(null);
    setTimeout(() => {
      game.current.enemyPlay();
      game.current.enemyAttack();
      game.current.endTurn();
    }, 1000);
  };

  return (
    <>
    <BattleLayout
      hand={hand}
      field={field}
      enemyField={enemyField}
      pp={pp}
      enemyPP={enemyPP}
      turn={turn}
      isPlayerTurn={isPlayerTurn}
      onPlayCard={handlePlayCard}
      onTurnEnd={handleEndTurn}
      attackerIndex={attackerIndex}
      setAttackerIndex={setAttackerIndex}
      onAttack={handleAttack} 
      hasAttacked={hasAttacked} 
      turnLabel={turnLabel}
      isDrawing={isDrawing}
      playerGraveyard={playerGraveyard}
      enemyGraveyard={enemyGraveyard}
      showGraveyard={showGraveyard}
      setShowGraveyard={setShowGraveyard}
    />

    <GameResultModal result={result} onClose={() => setResult(null)} />
  </>
  );
}

export default BattlePage;
