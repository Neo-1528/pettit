

import React from "react";
import { useNavigate } from "react-router-dom";

const ModeSelectPlayerPage = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center p-6">
      <h1 className="text-xl font-bold mb-4">プレイヤー対戦モードを選んでね！</h1>
      <button onClick={() => navigate("/versus")} className="btn block mx-auto my-2">オンライン対戦</button>
      <button onClick={() => navigate("/mode-select/player/friend")} className="btn block mx-auto my-2">フレンドと対戦</button>
    </div>
  );
};

export default ModeSelectPlayerPage;
