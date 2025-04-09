

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from '../firebase/firebase';
import Login from './Login';


const Home = ({ user }) => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  if (!authChecked) {
    return <div className="text-center mt-10 text-gray-500">読み込み中...</div>
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 to-white text-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-purple-700">プチ☆ボトルバトル</h1>

      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => navigate("/")}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded shadow"
        >
          🎮 ゲームをはじめる
        </button>

        <button
          onClick={() => navigate("/cards")}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded shadow"
        >
          🧾 カード一覧
        </button>

        <button
          onClick={() => navigate("/admin")}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded shadow"
        >
          🛠️ カード作成（管理用）
        </button>

        <button
          onClick={() => navigate("/deck")}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded shadow"
        >
          🎴 デッキ編集
        </button>

        <button
          onClick={() => navigate("/gacha")}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded shadow"
        >
        　🎁 ガチャ
        </button>

        <button
          onClick={() => navigate("/howto")}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded shadow"
        >
          📘 遊び方・ルール
        </button>

        <button
          onClick={() => navigate("/versus")}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow"
        >
          🆚 対戦モード
        </button>

        <button
          onClick={handleSignOut}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded shadow"
        >
          🚪 ログアウト
        </button>
      </div>

      {user && (
        <p className="mt-8 text-sm text-gray-600">ログイン中: {user.email}</p>
      )}
    </div>
  );
};

export default Home;
