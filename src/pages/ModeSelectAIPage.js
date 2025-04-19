
import { useNavigate } from "react-router-dom";

const levelColors = {
  あわ: "bg-blue-200 hover:bg-blue-300 text-blue-800",
  しゅわ: "bg-cyan-200 hover:bg-cyan-300 text-cyan-800",
  ぷく: "bg-pink-200 hover:bg-pink-300 text-pink-800",
  ばぶ: "bg-purple-200 hover:bg-purple-300 text-purple-800",
  まぼろし: "bg-yellow-200 hover:bg-yellow-300 text-yellow-800",
};

const ModeSelectAIPage = () => {
  const navigate = useNavigate();

  const handleSelectLevel = (level) => {
    navigate("/deck-select", { state: { aiLevel: level } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-6 text-pink-700 drop-shadow">
        AIの強さを選んでね！
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
        {["あわ", "しゅわ", "ぷく", "ばぶ", "まぼろし"].map((level) => (
          <button
            key={level}
            className={`py-3 px-6 rounded-xl shadow-md transform hover:scale-105 transition duration-200 font-bold text-lg ${levelColors[level]}`}
            onClick={() => handleSelectLevel(level)}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelectAIPage;
