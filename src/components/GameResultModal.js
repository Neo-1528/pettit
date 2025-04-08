// components/GameResultModal.js
import React from "react";

export default function GameResultModal({ result, onClose }) {
  if (!result) return null;

  let message = "";
  switch (result) {
    case "draw":
      message = "引き分け！";
      break;
    case "win":
      message = "あなたの勝ち！";
      break;
    case "lose":
      message = "あなたの負け！";
      break;
    default:
      message = result;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4">{message}</h2>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
