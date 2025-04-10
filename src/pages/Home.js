

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from '../firebase/firebase';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Login from './Login';
import StarterDeckSelector from "../components/StarterDeckSelector";
import homeImage from "../assets/home.png";






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

  if (!userData?.starterDeck) {
    return <StarterDeckSelector uid={user.uid} />;
  }
  

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img src={homeImage} alt="ホーム画面" className="absolute w-full h-full object-cover z-0" />

      <div className="absolute inset-0 z-10">

      {/* バトル */}
        <button
          onClick={() => navigate("/versus")}
          className="absolute top-[28vh] left-[18vw] w-[22vw] h-[10vh] bg-transparent" />

      {/* デッキ */}
        <button
          onClick={() => navigate("/deck")}
          className="absolute top-[28vh] left-[52vw] w-[22vw] h-[10vh] bg-transparent" />

      {/* ガチャ */}
        <button
          onClick={() => navigate("/gacha")}
          className="absolute top-[42vh] left-[35vw] w-[22vw] h-[10vh] bg-transparent" />

      {/* 遊び方・ルール */}
        <button
          onClick={() => navigate("/howto")}
          className="absolute top-[56vh] left-[20vw] w-[28vw] h-[10vh] bg-transparent" />

      {/* 図鑑 */}
        <button
          onClick={() => alert("図鑑はまだ未実装です")}
          className="absolute top-[59vh] left-[57vw] w-[20vw] h-[10vh] bg-transparent" />
        
      {/* 設定 */}
        <button
          onClick={() => alert("設定はまだ未実装です")}
          className="absolute top-[5vh] left-[5vw] w-[15vw] h-[10vh] bg-transparent" />

      {/* お知らせ */}
        <button
          onClick={() => alert("お知らせはまだ未実装です")}
          className="absolute top-[5vh] left-[5vw] w-[15vw] h-[10vh] bg-transparent" />
        
      {/* プレイヤー情報 */}
        <button
          onClick={() => alert("プレイヤー情報はまだ未実装です")}
          className="absolute bottom-[8vh] left-[10vw] w-[20vw] h-[10vh] bg-transparent" />
        
      {/* フレンド */}
        <button
          onClick={() => alert("フレンド機能はまだ未実装です")}
          className="absolute bottom-[8vh] left-[10vw] w-[20vw] h-[10vh] bg-transparent" />

      {/* ログアウト */}
      <button onClick={handleSignOut}  
        className="absolute top-[1vh] right-[1vw] text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
          ログアウト
        </button>
      </div>

      {user && (
        <p className="absolute bottom-2 left-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
          ログイン中: {user.email}</p>
      )}
    </div>
  );
};

export default Home;
