
// src/components/ZukanCard.jsx
import React from "react";
import "./ZukanCard.css";

const ZukanCard = ({ card }) => {
  return (
    <div className="zukan-card">
      {card.owned ? (
        <img src={`/images/${card.image}`} alt={card.name} />
      ) : (
        <div className="zukan-card-blackout">？？？</div>
      )}
      <p>{card.owned ? card.name : "？？？"}</p>
    </div>
  );
};

export default ZukanCard;
