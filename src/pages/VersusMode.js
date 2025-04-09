

import React, { useState, useEffect } from "react";
import { createRoom, joinRoom, subscribeToRoom } from "../firebase/room";



const VersusMode = () => {

  const [roomId, setRoomId] = useState("");
  const [currentRoom, setCurrentRoom] = useState(null);

  const handleCreateRoom = async () => {
    const newRoomId = await createRoom();
    setRoomId(newRoomId);
  };

  const handleJoinRoom = async () => {
    if (!roomId) return alert("ルームIDを入力してください");
    await joinRoom(roomId);
  };

  useEffect(() => {
    if (!roomId) return;
    const unsub = subscribeToRoom(roomId, (data) => {
      setCurrentRoom(data);
    });
    return () => unsub();
  }, [roomId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">🆚 対戦モード</h1>
      <p className="text-gray-600">AI対戦やプレイヤー対戦を選べる画面です。</p>

    <div className="my-4">
      <h2 className="text-lg font-bold mb-2">🧪 オンライン対戦</h2>
      <div className="flex flex-wrap gap-2 justify-center items-center">
        <button
          onClick={handleCreateRoom}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
        >
          🔧 ルームを作成
        </button>

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
      </div>
    </div>

    {currentRoom && (
      <div className="mt-4 text-left bg-white p-4 rounded shadow max-w-md mx-auto">
        <p><strong>Room ID:</strong> {roomId}</p>
        <p><strong>Player 1:</strong> {currentRoom.player1Id || "未設定"}</p>
        <p><strong>Player 2:</strong> {currentRoom.player2Id || "未設定"}</p>
        <p><strong>Turn:</strong> {currentRoom.turn}</p>
      </div>
    )}
  </div>
  );  
};

export default VersusMode;
