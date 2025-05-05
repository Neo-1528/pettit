
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";

import Home from "./pages/Home";
import Gacha from "./pages/Gacha";
import DeckListPage from "./pages/DeckListPage";
import DeckEditPage from './pages/DeckEditPage';
import HowToPlay from './pages/HowToPlay';
import ModeSelectPage from "./pages/ModeSelectPage";
import ModeSelectAIPage from "./pages/ModeSelectAIPage";
import ModeSelectPlayerPage from "./pages/ModeSelectPlayerPage";
import ModeSelectFriendPage from "./pages/ModeSelectFriendPage";
import Layout from "./components/Layout";
import GachaBoard from "./components/GachaBoard";
import DeckSelectPage from "./pages/DeckSelectPage";
import BattlePageAI from "./pages/BattlePageAI";
import BattlePagePVP from "./pages/BattlePagePVP";
import StarterDeckSelectPage from "./pages/StarterDeckSelectPage";
import ZukanPage from "./pages/ZukanPage";
import Login from "./pages/Login";
import MulliganPage from "./pages/MulliganPage";

export default function AppRouter() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [starterSelected, setStarterSelected] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);

      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setStarterSelected(data.starterSelected === true);
        } else {
          setStarterSelected(false);
        }
      } else {
        setStarterSelected(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!authChecked) {
    return <div className="text-center mt-10">認証チェック中...</div>;
  }

  if (!user && location.pathname !== "/login") {
    return <Navigate to="/login" replace />;
  }

  if (user && !starterSelected && location.pathname !== "/starter") {
    return <Navigate to="/starter" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home user={user} />} />
        <Route path="/gacha" element={<Gacha />} />
        <Route path="/shateki-gacha" element={<GachaBoard />} />
        <Route path="/deck" element={<DeckListPage />} />
        <Route path="/deck/edit/:deckId" element={<DeckEditPage />} />
        <Route path="/howto" element={<HowToPlay />} />
        <Route path="/mode-select" element={<ModeSelectPage />} />
        <Route path="/mode-select/ai" element={<ModeSelectAIPage />} />
        <Route path="/mode-select/player" element={<ModeSelectPlayerPage />} />
        <Route path="/mode-select/friend" element={<ModeSelectFriendPage />} />
        <Route path="/mulligan" element={<MulliganPage />} />
        <Route path="/battle-ai" element={<BattlePageAI />} />
        <Route path="/battle-pvp" element={<BattlePagePVP />} />
        <Route path="/deck-select" element={<DeckSelectPage user={user} />} />
        <Route path="/zukan" element={<ZukanPage />} />
        <Route path="/starter" element={<StarterDeckSelectPage />} />
      </Route>
    </Routes>
  );
}