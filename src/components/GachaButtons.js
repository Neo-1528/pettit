
// components/GachaButtons.jsx
import React from "react";

const GachaButtons = ({ onShoot, onTenShoot, coins }) => {
  const canShoot = coins >= 1;
  const canTenShoot = coins >= 10;

  return (
    <div className="flex flex-col items-center mt-6 gap-3">
      <p className="text-sm text-gray-700">
        所持プチコイン：<span className="font-bold">{coins}</span> 枚
      </p>

      <div className="flex gap-4">
        <button
          onClick={onShoot}
          disabled={!canShoot}
          className={`px-4 py-2 rounded font-bold ${
            canShoot ? "bg-yellow-400 hover:bg-yellow-500" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          一回 祓射（1枚）
        </button>

        <button
          onClick={onTenShoot}
          disabled={!canTenShoot}
          className={`px-4 py-2 rounded font-bold ${
            canTenShoot ? "bg-orange-400 hover:bg-orange-500" : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          十回 奉納（10枚）
        </button>
      </div>
    </div>
  );
};

export default GachaButtons;
