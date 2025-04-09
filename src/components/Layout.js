

// src/components/Layout.js
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ホーム画面ではボタンを非表示にしたい場合の処理
  const showHomeButton = location.pathname !== "/home";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      {showHomeButton && (
        <div className="fixed bottom-0 w-full bg-white/80 text-center py-2 border-t border-gray-300 z-40">
          <button
            onClick={() => navigate("/home")}
            className="text-blue-600 font-bold text-lg"
          >
            🏠 ホームに戻る
          </button>
        </div>
      )}
    </div>
  );
};

export default Layout;
