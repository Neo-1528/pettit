
// components/GachaBoard.jsx
import React, { useEffect, useRef, useState } from "react";
import Bottle from "./Bottle";
import { useGachaLogic } from "../gachadata/useGachaLogic";
import GachaResult from "./GachaResult";
import MultiGachaResult from "./MultiGachaResult";
import { motion } from "framer-motion";


const GachaBoard = () => {
  const [coins, setCoins] = useState(1000);
  const [isShooting, setIsShooting] = useState(false);

  const {
    shootBottle,
    shootTenBottles,
    gachaResult,
    reset,
    isAnimating,
    selectedIndex,
    revealedIndex,
    isKaguraTime,
    multiResult,
    showMultiResult,
  } = useGachaLogic();

  const audioRef = useRef(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (audioRef.current && !isAudioPlaying) {
      audioRef.current.play().catch((e) => {
        console.log("BGM自動再生に失敗:", e.message);
      });
      setIsAudioPlaying(true);
    }
  }, []);

  const handleOneShoot = () => {
    if (coins >= 1 && !isAnimating) {
      setCoins((prev) => prev - 1);
      setIsShooting(true);
      shootBottle();

      setTimeout(() => setIsShooting(false), 400);
    }
  };

  const handleTenShoot = () => {
    if (coins >= 10 && !isAnimating) {
      setCoins((prev) => prev - 10);
      setIsShooting(true);
      shootTenBottles();

      setTimeout(() => setIsShooting(false), 400);
    }
  };

  return (
    <div className="relative w-full min-h-screen max-w-[430px] mx-auto overflow-hidden">
      <img src="/images/night.png" alt="背景" className="absolute inset-0 w-full h-full object-cover -z-20" />
      <img src="/images/kagura-background.png" alt="背景" className="absolute inset-0 w-full h-full object-cover -z-10" />

      <img src="/images/shateki-kanban.png" alt="射的神楽" className="w-48 mx-auto mt-20 z-10" />

      <div className="relative w-full flex justify-center mt-[40px] z-20">
        <img src="/images/tana.png" alt="棚" className="w-full w-[315px]" />

        <div className="absolute top-[20px] left-1/2 -translate-x-[62%] grid grid-cols-5 gap-x-2 gap-y-6 w-[200px]">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-[64px] h-[80px]">
            <Bottle
              index={i}
              isSelected={selectedIndex === i}
              isRevealed={revealedIndex === i}
              isKaguraTime={isKaguraTime}
              onClick={() => {}}
            />
          </div>
          ))}
        </div>
      </div>

      <motion.img
       src="/images/gun.png"
       alt="銃"
       className="absolute top-[460px] left-1/2 -translate-x-1/2 w-60 z-20"
       animate={isShooting ? { y: -10, rotate: -8 } : { y: 0, rotate: 0 }}
       transition={{ type: "spring", stiffness: 300 }}
      />

      <div className="absolute bottom-[130px] left-1/2 -translate-x-1/2 flex justify-center gap-4 mt-4 z-30">
        <button onClick={handleOneShoot}>
          <img src="/images/button-one.png" alt="一回奉納" className="w-28" />
        </button>
        <button onClick={handleTenShoot}>
          <img src="/images/button-ten.png" alt="十回奉納" className="w-28" />
        </button>
      </div>

      <p className="absolute bottom-[60px] left-1/2 -translate-x-1/2 text-sm text-white text-center z-30">所持プチコイン：{coins}枚</p>

      {gachaResult && <GachaResult result={gachaResult} onClose={reset} />}
      {showMultiResult && <MultiGachaResult results={multiResult} onClose={reset} />}

      {isKaguraTime && (
      <>
        {/* グラデーション背景アニメ */}
        <div className="absolute inset-0 z-10 pointer-events-none animate-wiggle bg-gradient-to-br from-yellow-100 via-pink-200 to-yellow-100 opacity-40" />

        {/* 光るラベル */}
        <div className="absolute top-4 w-full text-center z-30">
          <p className="inline-block bg-gradient-to-r from-yellow-300 via-white to-yellow-300 bg-clip-text text-transparent font-bold text-2xl animate-bounce drop-shadow-lg px-6 py-2">
            🎐 神楽タイム突入 🎐
          </p>
        </div>
      </>
      )}

       <audio ref={audioRef} src="/sounds/kagura-bgm.mp3" loop />
    </div>
   
  );
};

export default GachaBoard;
