

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket"; // ← Socket.IO接続

const ModeSelectFriendPage = () => {
  const [roomId, setRoomId] = useState("");
  const [role, setRole] = useState(null);
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState(null);

  const navigate = useNavigate();

  const handleJoinRoom = () => {
    if (!roomId) return alert("ルームIDを入力してください");
    socket.emit("joinRoom", roomId);
  };

  useEffect(() => {
    socket.on("playerRole", (playerRole) => {
      setRole(playerRole);
    });

    socket.on("playerJoined", (playerList) => {
      setPlayers(playerList);
    });

    socket.on("gameStart", ({ firstTurn }) => {
      setTurn(firstTurn);
      navigate("/battle-pvp", {
        state: {
          mode: "pvp",
          roomId,
          role,
        },
      });
    });

    return () => {
      socket.off("playerRole");
      socket.off("playerJoined");
      socket.off("gameStart");
    };
  }, [roomId, role, navigate]);

  return (
    <div className="flex flex-wrap gap-2 justify-center items-center p-4">
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="ルームIDを入力"
        className="border px-2 py-1 rounded"
      />
      <button
        onClick={handleJoinRoom}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        🚪 参加する
      </button>

      {roomId && (
        <div className="mt-4 text-left bg-white p-4 rounded shadow max-w-md mx-auto">
          <p><strong>Room ID:</strong> {roomId}</p>
          <p><strong>あなたの役割:</strong> {role || "未割り当て"}</p>
          <p><strong>現在のプレイヤー数:</strong> {players.length}</p>
          <p><strong>先攻:</strong> {turn || "未開始"}</p>
        </div>
      )}
    </div>
  );
};

export default ModeSelectFriendPage;
