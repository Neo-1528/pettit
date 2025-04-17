

import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useLocation } from "react-router-dom";

export default function BattlePage() {
  const location = useLocation();
  const { roomId, role } = location.state || {};

  const [myField, setMyField] = useState([]);
  const [opponentField, setOpponentField] = useState([]);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [logs, setLogs] = useState([]);
  const [selectedAttacker, setSelectedAttacker] = useState(null);
  const [myPP, setMyPP] = useState(50);
  const [opponentPP, setOpponentPP] = useState(50);
  const [result, setResult] = useState(null);


  const isMyTurn = role === currentTurn;

  // ソケット初期化
  useEffect(() => {
    socket.emit("joinRoom", roomId);

    socket.on("gameStart", ({ firstTurn }) => {
      setCurrentTurn(firstTurn);
    });

    socket.on("turnChanged", ({ currentTurn }) => {
      setCurrentTurn(currentTurn);
    });

    socket.on("attacked", ({ attackerName, damage }) => {
      setLogs((prev) => [...prev, `${attackerName} の攻撃！ダメージ ${damage}`]);
    });

    socket.on("receiveAttack", ({ attacker, targetIndex }) => {
      setMyField((prev) => {
        const newField = [...prev];
        const target = newField[targetIndex];
        if (!target) return newField;
        target.hp -= attacker.ap;
        if (target.hp <= 0) {
          newField.splice(targetIndex, 1);
        }
        return newField;
      });
    });

    socket.on("log", ({ text }) => {
      setLogs((prev) => [...prev, text]);
    });

    socket.on("updateField", ({ fields, pp }) => {
      if (role === "player1") {
        setMyField(fields.player1);
        setOpponentField(fields.player2);
        setMyPP(pp.player1);
        setOpponentPP(pp.player2);
      } else {
        setMyField(fields.player2);
        setOpponentField(fields.player1);
        setMyPP(pp.player2);
        setOpponentPP(pp.player1);
      }
    });

    socket.on("gameEnd", ({ winner }) => {
      setResult(role === winner ? "win" : "lose");
    });

    return () => {
      socket.off("gameStart");
      socket.off("turnChanged");
      socket.off("attacked");
      socket.off("receiveAttack");
      socket.off("log");
      socket.off("updateField");
      socket.off("gameEnd");
    };
  }, [roomId, role]);

  if (!roomId || !role) {
    return <p>ルーム情報がありません。モード選択からやり直してください。</p>;
  }

  // カードを出す処理
  const handlePlayCard = () => {
    const card = { name: "スライム", pp: 2, ap: 1, hp: 3 };
    setMyField((prev) => [...prev, card]);
    socket.emit("playCard", {
      roomId,
      card,
      index: 0,
      role,
    });
  };

  return (
    <div>
      <p>あなたの役割: {role}</p>

      <h3>あなたのフィールド</h3>
      <ul>
        {myField.map((card, i) => (
          <li key={i}>
            {card.name}
            {isMyTurn && (
              <button onClick={() => setSelectedAttacker({ ...card, index: i })}>
                攻撃する
              </button>
            )}
          </li>
        ))}
      </ul>

      <h3>相手のフィールド</h3>
      <ul>
        {opponentField.map((card, i) => (
          <li key={i}>
            {card.name}
            {selectedAttacker && (
              <button
                onClick={() => {
                  socket.emit("attackRequest", {
                    roomId,
                    attacker: selectedAttacker,
                    targetIndex: i,
                  });
                  setSelectedAttacker(null);
                }}
              >
                このカードを攻撃！
              </button>
            )}
          </li>
        ))}
      </ul>

      <button onClick={handlePlayCard}>カードを出す</button>

      <button onClick={() => socket.emit("endTurn", { roomId })} disabled={!isMyTurn}>
        ターン終了
      </button>

      <button
        onClick={() =>
          socket.emit("attack", {
            roomId,
            attackerName: "スライム",
            damage: 5,
          })
        }
        disabled={!isMyTurn}
      >
        攻撃する
      </button>

      {result && <h2>{result === "win" ? "勝利！🎉" : "敗北…😢"}</h2>}
    </div>
  );
}
