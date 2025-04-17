
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeckCard = ({ deck, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div style={{ border: '1px solid gray', padding: '10px', margin: '5px' }}>
      <h3>{deck.name || "（名称未設定）"}</h3>
      <p>{deck.cards.length} 枚</p>
      <button onClick={() => navigate(`/deck/edit/${deck.id}`)}>編集</button>
      <button onClick={() => onDelete(deck.id)}>🗑</button>
    </div>
  );
};

export default DeckCard;
