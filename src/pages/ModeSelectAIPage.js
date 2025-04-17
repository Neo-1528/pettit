import { useNavigate } from "react-router-dom";


const ModeSelectAIPage = () => {
  const navigate = useNavigate();

  const handleSelectLevel = (level) => {
    navigate("/deck-select", { state: { aiLevel: level } });
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-xl font-bold mb-4">AIの強さを選んでね！</h1>
      {["あわ", "しゅわ", "ぷく", "ばぶ", "まぼろし"].map((level) => (
        <button 
          key={level} 
          className="btn block mx-auto my-2"
          onClick={() => handleSelectLevel(level)}
        >
            {level}
        </button>
      ))}
    </div>
  );
};

export default ModeSelectAIPage;
