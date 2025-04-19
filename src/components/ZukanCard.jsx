
// src/components/ZukanCard.jsx
import React from "react";
import CardComponent from "./CardComponent";

const ZukanCard = ({ card }) => {
  const displayImage = card.owned
    ? card.imageSrc || `/images/${card.image}` // 両方対応
    : "/images/card-unknown.jpg"; // 黒塗り画像（未所持用）

  return (
    <div className="transition transform hover:scale-105">
      <CardComponent imageSrc={displayImage} />
    </div>
  );
};

export default ZukanCard;
