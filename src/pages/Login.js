// src/Login.js

import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from '../firebase';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("ログイン成功:", result.user);
      alert(`ようこそ、${result.user.displayName}さん！`);
      navigate('/home');
    } catch (error) {
      console.error("ログイン失敗:", error);
      alert("ログインに失敗しました！");
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      <button onClick={handleLogin}>Googleでログイン</button>
    </div>
  );
};

export default Login;
