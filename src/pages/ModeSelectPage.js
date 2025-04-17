

// src/pages/ModeSelectPage.js

import React from "react";
import { useNavigate } from "react-router-dom";

const ModeSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-blue-200 p-4">
      <h1 className="text-2xl font-bold mb-6">対戦モードを選んでね！</h1>

      <button
        onClick={() => navigate("/mode-select/ai")}
        className="mb-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
      >
        🤖 AIと対戦する
      </button>

      <button
        onClick={() => navigate("/mode-select/friend")}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        🧑‍🤝‍🧑 プレイヤーと対戦する
      </button>
    </div>
  );
};

export default ModeSelectPage;
