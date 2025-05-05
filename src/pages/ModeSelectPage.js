
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ModeSelectPage.css";

const ModeSelectPage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="battle-mode-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/images/battle-mode.jpg"})`,
      }}
    >
      <button
        className="bottle-button ai-bottle"
        onClick={() => navigate("/mode-select/ai")}
      />
      <button
        className="bottle-button player-bottle"
        onClick={() => navigate("/mode-select/friend")}
      />
    </div>
  );
};

export default ModeSelectPage;
