

// src/AppRouter.js
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import App from "./App"; // ゲーム画面
import CardListPage from "./pages/CardListPage";
import Gacha from "./pages/Gacha";
import DeckEditor from './pages/DeckEditor';
import HowToPlay from './pages/HowToPlay';
import VersusMode from './pages/VersusMode';
import AdminCardForm from './pages/AdminCardForm';
import Layout from "./components/Layout";

export default function AppRouter() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return <div className="text-center mt-10">読み込み中...</div>;
  }

  return (
    <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home user={user} />} />
      <Route path="/cards" element={<CardListPage />} />
      <Route path="/gacha" element={<Gacha />} />
      <Route path="/deck" element={<DeckEditor />} />
      <Route path="/howto" element={<HowToPlay />} />
      <Route path="/versus" element={<VersusMode />} />
      <Route path="/admin" element={<AdminCardForm />} />
      <Route path="/battle" element={<App />} />
    </Route>
    </Routes>
  );
}
