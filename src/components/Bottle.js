// components/Bottle.jsx
import React from "react";
import { motion } from "framer-motion"; // アニメ用

const bottleImages = [
  "/images/bottle-inu.png",
  "/images/bottle-tatsu.png",
  "/images/bottle-nezumi.png",
  "/images/bottle-doku.png",
  "/images/bottle-tora.png",
  "/images/bottle-inu-kuro.png",
];

const Bottle = ({ index, isSelected, onClick, isRevealed, isKaguraTime }) => {
  const imageSrc = bottleImages[index % bottleImages.length];

  return (
    <motion.div
      className={`relative cusor-pointer w-[80px] h-[100px]`}
      onClick={() => onClick(index)}
      animate={
        isSelected
          ? { y: -40, scale: 1.1 }
          : { y: 0, scale: 1 }
      }
      transition={{ duration: 0.5 }}
    >
      <img src={imageSrc} alt={`ボトル${index}`} className="w-full h-full object-contain" />


      {/* 命中時の光 */}
      {isRevealed && (
        <motion.div
          className="absolute inset-0 rounded-full bg-yellow-300 opacity-30"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}

        {isRevealed && isKaguraTime && (
        <motion.div
            className="absolute inset-0 rounded-full bg-yellow-100 opacity-50 border-4 border-yellow-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8 }}
        />
        )}

    </motion.div>
  );
};

export default Bottle;
