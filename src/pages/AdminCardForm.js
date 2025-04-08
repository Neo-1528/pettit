// src/AdminCardForm.js

import { useState } from "react";
import { saveCardToFirestore } from '../saveCard';
import { auth } from '../firebase';

const AdminCardForm = () => {
  const [card, setCard] = useState({
    name: "",
    rarity: "あわ",
    PP: 1,
    HP: 1,
    AP: 1,
    ability1: "",
    ability2: "",
    voiceLine: "",
    attribute: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({
      ...prev,
      [name]: name === "PP" || name === "HP" || name === "AP" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert("ログインしてください！");
      return;
    }
    await saveCardToFirestore(card, user.uid);
    alert("カードを保存しました！");
    setCard({
      name: "",
      rarity: "あわ",
      PP: 1,
      HP: 1,
      AP: 1,
      ability1: "",
      ability2: "",
      voiceLine: "",
      attribute: "",
      image: "",
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded shadow my-4">
      <h2 className="text-xl font-bold mb-4 text-center">キャラカード登録（開発者用）</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="name" value={card.name} onChange={handleChange} placeholder="名前" className="w-full p-2 border rounded" required />
        <select name="rarity" value={card.rarity} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="あわ">あわ</option>
          <option value="しゅわ">しゅわ</option>
          <option value="ぷく">ぷく</option>
          <option value="ばぶ">ばぶ</option>
          <option value="まぼろし">まぼろし</option>
        </select>
        <input name="PP" type="number" value={card.PP} onChange={handleChange} placeholder="PP" className="w-full p-2 border rounded" required />
        <input name="HP" type="number" value={card.HP} onChange={handleChange} placeholder="HP" className="w-full p-2 border rounded" required />
        <input name="AP" type="number" value={card.AP} onChange={handleChange} placeholder="AP" className="w-full p-2 border rounded" required />
        <input name="ability1" value={card.ability1} onChange={handleChange} placeholder="アビリティ1" className="w-full p-2 border rounded" />
        <input name="ability2" value={card.ability2} onChange={handleChange} placeholder="アビリティ2" className="w-full p-2 border rounded" />
        <input name="voiceLine" value={card.voiceLine} onChange={handleChange} placeholder="セリフ（ボイスライン）" className="w-full p-2 border rounded" />
        <select name="attribute" value={card.attribute} onChange={handleChange} placeholder="属性" className="w-full p-2 border rounded" >
        <option value="">属性を選択</option>
        <option value="火">火</option>
        <option value="水">水</option>
        <option value="木">木</option>
        <option value="光">光</option>
        <option value="闇">闇</option>
        </select>
        <input name="image" value={card.image} onChange={handleChange} placeholder="画像URL（任意）" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">登録する</button>
      </form>
    </div>
  );
};

export default AdminCardForm;
