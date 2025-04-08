import React, { useState, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { deckTypeA, deckTypeB } from './cardData';
import Login from "./pages/Login";
import { auth } from "./firebase";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CardListPage from "./pages/CardListPage";
import MainGamePage from "./pages/MainGamePage";
import Home from './pages/Home';
import Gacha from './pages/Gacha';
import DeckEditor from './pages/DeckEditor';
import HowToPlay from './pages/HowToPlay';
import VersusMode from './pages/VersusMode';





function generateDeck(size, baseCards) {
  const deck = [];
  for (let i = 0; i < size; i++) {
    deck.push({ ...baseCards[i % baseCards.length] });
  }
  return deck;
}

function containsLowPPCards(cards, maxPP = 3) {
  return cards.some(card => card.pp <= maxPP);
}

export default function App() {
  const [playerPP, setPlayerPP] = useState(50);
  const [enemyPP, setEnemyPP] = useState(50);
  const [hand, setHand] = useState([]);
  const [enemyHand, setEnemyHand] = useState([]);
  const [field, setField] = useState([]);
  const [enemyField, setEnemyField] = useState([]);
  const [graveyard, setGraveyard] = useState([]);
  const [enemyGraveyard, setEnemyGraveyard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [mulliganCount, setMulliganCount] = useState(3);
  const [waitingForStart, setWaitingForStart] = useState(true);
  const [log, setLog] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [deck, setDeck] = useState([]);
  const [enemyDeck, setEnemyDeck] = useState([]);
  const [enemyDeckType, setEnemyDeckType] = useState(null);
  const [hitIndex, setHitIndex] = useState(null); //攻撃対象カードにanimate-hitを追加
  const [selectedEnemyIndex, setSelectedEnemyIndex] = useState(null);  //攻撃する敵カードを選択
  const [hasAttackedThisPhase, setHasAttackedThisPhase] = useState(false);  //攻撃済みフラグ
  const [isHandZoomed, setIsHandZoomed] = useState(false);  //手札拡大
  const [gameResult, setGameResult] = useState(null); // 結果: "win", "lose", "draw"
  const bgmRef = useRef(null);
  const [turn, setTurn] = useState(1);
  const isPlayerTurn = turn % 2 === 1;
  const [user, setUser] = useState(null); //ユーザー情報を保存
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedDeck) {
      const initial = generateDeck(30, selectedDeck);
      setDeck(initial);
      drawInitialHand(initial);
      drawEnemyCards(5, turn);
    }
  }, [selectedDeck]);

//アニメーション追加
  useEffect(() => {
    if (field.length > 0) {
      const timer = setTimeout(() => {
        setField(prev => prev.map(c => ({ ...c, animate: false })));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [field]);
  
//ＢＧＭ設定
  useEffect(() => {
    if (!bgmRef.current) {
      const bgm = new Audio('/sounds/bgm.mp3');
      bgm.loop = true;
      bgm.volume = 0.5;
      bgmRef.current = bgm;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setUserId(currentUser ? currentUser.uid : null);
    });
    return () => unsubscribe();
  }, []);

  const handleDeckSelection = (type) => {
    const selected = type === "A" ? deckTypeA : deckTypeB;
    const deck = generateDeck(30, selected);
    const enemyDeckList = Math.random() < 0.5 ? deckTypeA : deckTypeB;
  
    setDeck(deck);
    setSelectedDeck(selected);
    setEnemyDeckType(enemyDeckList);
    setEnemyDeck(generateDeck(30, enemyDeckList));
  };
  

  const playSE = (file) => {
    const audio = new Audio(`/sounds/${file}`);
    audio.volume = 0.8;
    audio.play();
  };

  const stopBGM = () => {
    if (bgmRef.current) {
      bgmRef.current.pause();
    }
  };

  const drawInitialHand = (deckSource) => {
    let newDeck = [...deckSource];
    let drawn;
    do {
      drawn = newDeck.splice(0, 5);
    } while (!containsLowPPCards(drawn) && mulliganCount === 3);
    setDeck(newDeck);
    setHand(drawn);
  };

  const handleMulligan = () => {
    if (mulliganCount > 0) {
      setMulliganCount(mulliganCount - 1);
      drawInitialHand(deck);
    }
  };

  const startGame = () => {
    setWaitingForStart(false);
    
    if (bgmRef.current) {
      bgmRef.current.play().catch((e) => {
        console.warn("BGM再生失敗:", e);
    });
   }

   enemyPlayCards();
  };

  const getPPRestriction = (turn) => {
    if (turn <= 6) return 3;
    if (turn <= 20) return 7;
    return Infinity;
  };

  const drawCards = (count, currentTurn) => {
    const newDeck = [...deck];
    const newHand = [...hand];
    const restriction = getPPRestriction(currentTurn);
    for (let i = 0; i < count; i++) {
      const validCards = newDeck.filter(card => card.pp <= restriction);
      if (validCards.length === 0) break;
      const selected = validCards[Math.floor(Math.random() * validCards.length)];
      const index = newDeck.findIndex(card => card === selected);
      newHand.push(selected);
      newDeck.splice(index, 1);
    }
    setDeck(newDeck);
    setHand(newHand);
  };

  const drawEnemyCards = (count, currentTurn) => {
    const newDeck = [...enemyDeck];
    const newHand = [...enemyHand];
    const restriction = getPPRestriction(currentTurn);
    for (let i = 0; i < count; i++) {
      const validCards = newDeck.filter(card => card.pp <= restriction);
      if (validCards.length === 0) break;
      const selected = validCards[Math.floor(Math.random() * validCards.length)];
      const index = newDeck.findIndex(card => card === selected);
      newHand.push(selected);
      newDeck.splice(index, 1);
    }
    setEnemyDeck(newDeck);
    setEnemyHand(newHand);
  };

  const playCard = (card, index) => {
    if (!isPlayerTurn || gameOver || waitingForStart) return;
    if (gameOver || waitingForStart) return;
    if (field.length >= 3) {
      alert("これ以上フィールドに出せません！（最大3体）");
      return;
    }
    if (playerPP >= card.pp) {
      playSE("summon.mp3");

      const isRare = card.rarity === "SSR" || card.rarity === "UR";

      setField([...field, { ...card, currentHp: card.hp, animate: true, rareEffect: isRare, uid: Date.now() + Math.random() }]); //アニメーションで出す
      setHand(hand.filter((_, i) => i !== index));
    } else {
      alert("PPが足りません！");
    }
  };

  const enemyPlayCards = () => {
    let newEnemyPP = enemyPP;
    let newEnemyHand = [...enemyHand];
    let newEnemyField = [...enemyField];
  
    const isAggressive = field.length > enemyField.length;
  
    // 高AP → 高HP 順で賢く並べる
    newEnemyHand.sort((a, b) => {
      if (isAggressive) {
        return b.ap - a.ap; // 攻撃優先
      } else {
        return b.hp - a.hp; // 防御優先
      }
    });
  
    for (let i = 0; i < newEnemyHand.length; i++) {
      const card = newEnemyHand[i];
      if (newEnemyField.length >= 3) break;
  
      // 柔軟に判断するように変更（PPに余裕があれば出す）
      const shouldPlay = isAggressive || newEnemyPP - card.pp >= 0;
  
      if (newEnemyPP >= card.pp && shouldPlay) {
        newEnemyPP -= card.pp;
        newEnemyField.push({ ...card, currentHp: card.hp });
        newEnemyHand.splice(i, 1);
        i--; // index調整
      }
    }
  
    setEnemyPP(newEnemyPP);
    setEnemyHand(newEnemyHand);
    setEnemyField(newEnemyField);
  };

  //攻撃処理
  const handleAttack = (attackerIndex, targetIndex) => {
    if (!isPlayerTurn || gameOver) return;
    const attacker = field[attackerIndex];
    const target = enemyField[targetIndex];
  
    if (!attacker || !target || gameOver) return;
  
    playSE("attack.mp3");
    setHitIndex(targetIndex); // ブルブル揺らす
  
    setTimeout(() => {
      setHitIndex(null);
    }, 500);
  
    const newEnemyField = [...enemyField];
    const newField = [...field];
    newField[attackerIndex] = {
      ...newField[attackerIndex],
      attacked: true
    };
    const newEnemyGraveyard = [...enemyGraveyard];
    let newEnemyPP = enemyPP;
    let newLog = [...log];
  
    newEnemyField[targetIndex].currentHp -= attacker.ap;
    newLog.push({ type: "player", text: `${attacker.name} が ${target.name} に ${attacker.ap} ダメージ！` });
  
    if (newEnemyField[targetIndex].currentHp <= 0) {
      newLog.push({ type: "player", text: `${target.name} を撃破！PP-${target.pp}` });
      newEnemyPP -= target.pp;
      newEnemyGraveyard.push(newEnemyField[targetIndex]);
      newEnemyField.splice(targetIndex, 1); // 倒れたら削除
    }
  
    setEnemyField(newEnemyField);
    setEnemyGraveyard(newEnemyGraveyard);
    setEnemyPP(Math.max(0, newEnemyPP));
    setLog(newLog);
    setField(newField);
  };
  
  
  

  const attackTurn = () => {
    playSE("attack.mp3");
      //敵に攻撃アニメーション
    setHitIndex(0); // i = index or attacked card

    setTimeout(() => {
      setHitIndex(null);  //0.5秒後にアニメーション終了
    }, 500);
    let newEnemyField = [...enemyField];
    let newField = [...field];
    let newEnemyPP = enemyPP;
    let newPlayerPP = playerPP;
    let newGraveyard = [...graveyard];
    let newEnemyGraveyard = [...enemyGraveyard];
    let logEntries = [];

//自動攻撃
    enemyField.forEach(attacker => {
      if (newField.length > 0) {
        newField[0].currentHp -= attacker.ap;
        logEntries.push({ text: `${attacker.name} が ${newField[0].name} に ${attacker.ap} ダメージ！`, type: 'enemy' });
        if (newField[0].currentHp <= 0) {
          logEntries.push({ text: `${newField[0].name} が倒された！PP-${newField[0].pp}`, type: 'enemy' });
          newPlayerPP -= newField[0].pp;
          newGraveyard.push(newField[0]);
          newField.shift();
        }
      }
    });

    setEnemyField(newEnemyField);
    setEnemyPP(Math.max(0, newEnemyPP));
    setEnemyGraveyard(newEnemyGraveyard);
    setField(newField);
    setPlayerPP(Math.max(0, newPlayerPP));
    setGraveyard(newGraveyard);
    setLog(prev => [...prev, ...logEntries]);
    checkGameEnd(turn + 1, newPlayerPP, newEnemyPP);
  };

  const checkGameEnd = (nextTurn, nextPlayerPP, nextEnemyPP) => {
    if (nextPlayerPP <= 0 && nextEnemyPP <= 0) {
      playSE("lose.mp3");
      setGameResult("draw");
      setGameOver(true);
    } else if (nextPlayerPP <= 0) {
      playSE("lose.mp3");
      setGameResult("lose");
      setGameOver(true);
    } else if (nextEnemyPP <= 0) {
      playSE("win.mp3");
      setGameResult("win");
      setGameOver(true);
    } else if (nextTurn > 40) {
      if (nextPlayerPP > nextEnemyPP) {
        setGameResult("win");
      } else if (nextPlayerPP < nextEnemyPP) {
        setGameResult("lose");
      } else {
        setGameResult("draw");
      }
      setGameOver(true);
    }
  };
  
 
  const nextTurn = () => {
    if (gameOver) return;

      const next = turn + 1;
      setTurn(next);

      if (next > 40) {
        if (playerPP > enemyPP) {
          setGameResult("win");
        } else if (playerPP < enemyPP) {
          setGameResult("lose");
        } else {
          setGameResult("draw");
        }
        setGameOver(true);
        return;
      }

      // ターンごとの処理
      if (next % 2 === 1) {
        drawCards(1, next);
        setHasAttackedThisPhase(false);
        setField(prev => prev.map(c => ({ ...c, attacked: false})));
      } else {
        drawEnemyCards(1, next);
        enemyPlayCards();
        attackTurn();
        checkGameEnd(next, playerPP, enemyPP);
      }
  };

  return (
  <Router>
    <div className="p-4 min-h-screen bg-gradient-to-br from-green-100 to-blue-200">

    <Routes>
      <Route path="/home" element={<Home user={user} />} />
      <Route path="/gacha" element={<Gacha />} />
      <Route path="/deck" element={<DeckEditor />} />
      <Route path="/howto" element={<HowToPlay />} />
      <Route path="/versus" element={<VersusMode />} />
      {/* <Route path="/admin" element={<AdminCardForm />} /> */}

      {/* トップページ(元のゲーム画面) */}
      <Route path="/" element={<Home user={user} />} />
      <Route path="/game" element={
        <MainGamePage
        user={user}
        waitingForStart={waitingForStart}
        startGame={startGame}
        userId={userId}
        selectedDeck={selectedDeck}
        selectedEnemyIndex={selectedEnemyIndex}
        handleDeckSelection={handleDeckSelection}
        mulliganCount={mulliganCount}
        handleMulligan={handleMulligan}
        turn={turn}
        isPlayerTurn={isPlayerTurn}
        nextTurn={nextTurn}
        playerPP={playerPP}
        enemyPP={enemyPP}
        deck={deck}
        graveyard={graveyard}
        hand={hand}
        playCard={playCard}
        field={field}
        enemyField={enemyField}
        handleAttack={handleAttack}
        setSelectedEnemyIndex={setSelectedEnemyIndex}
        hasAttackedThisPhase={hasAttackedThisPhase}
        setHasAttackedThisPhase={setHasAttackedThisPhase}
        hitIndex={hitIndex}
        gameResult={gameResult}
        setGameResult={setGameResult}
        log={log}
      />
      
      } />

      {/* カード一覧ページ */}
      <Route path="/cards" element={<CardListPage />} />
    </Routes>
    </div>
  </Router>
  );
}

