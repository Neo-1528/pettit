
import React, { useState, useEffect, use } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Login from "./Login";

const Home = ({ user }) => {
  const [userData, setUserData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (userData && userData.starterSelected === false) {
      navigate("/starter");
    }
  }, [userData, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("ログアウトに失敗しました", error);
    }
  };

  if (!authChecked) return <div className="text-center mt-10 text-gray-500">読み込み中...</div>;
  if (!user) return <Login />;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-200 to-white text-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-purple-700">プチ☆ボトルバトル</h1>

      <div className="space-y-4 w-full max-w-xs">
        <button onClick={() => navigate("/mode-select")} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 z-0 rounded shadow">
          🆚 対戦する
        </button>

        <button onClick={() => navigate("/deck")} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 z-0 rounded shadow">
          🎴 デッキ編集
        </button>

        <button onClick={() => navigate("/shateki-gacha")} className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 z-0 rounded shadow">
          🎐 射的神楽
        </button>

        <button onClick={() => navigate("/zukan")} className="w-full bg-green-500 hover:bg-blue-600 text-white py-2 px-4 z-0 rounded shadow">
          図鑑
        </button>

        <button onClick={() => navigate("/howto")} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 z-0 rounded shadow">
          📘 遊び方・ルール
        </button>

        <button onClick={handleSignOut} className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 z-0 rounded shadow">
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
