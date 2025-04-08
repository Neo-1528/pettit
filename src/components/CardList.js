// src/CardList.js

import { useEffect, useState } from "react";
import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth } from '../firebase';

const CardList = () => {
  const [cards, setCards] = useState([]);
  const [editingCardId, setEditingCardId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [rarityFilter, setRarityFilter] = useState("all");
  const [attributeFilter, setAttributeFilter] = useState("all");

  const fetchCards = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "cards"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const result = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCards(result);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const startEditing = (card) => {
    setEditingCardId(card.id);
    setEditForm({ ...card });
  };

  const cancelEditing = () => {
    setEditingCardId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    const cardRef = doc(db, "cards", editingCardId);
    await updateDoc(cardRef, editForm);
    setEditingCardId(null);
    fetchCards();
  };

  const deleteCard = async (id) => {
    const cardRef = doc(db, "cards", id);
    await deleteDoc(cardRef);
    fetchCards();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: name === "PP" || name === "HP" || name === "AP" ? parseInt(value) : value,
    }));
  };

  const filteredCards = cards.filter((card) => {
    const rarityMatch = rarityFilter === "all" || card.rarity === rarityFilter;
    const attributeMatch = attributeFilter === "all" || card.attribute === attributeFilter;
    return rarityMatch && attributeMatch;
  });

  return (
    <div className="max-w-3xl mx-auto bg-white p-4 rounded shadow my-4">
      <h2 className="text-xl font-bold mb-4 text-center">保存されたカード一覧</h2>

      <div className="flex justify-center gap-4 mb-4">
        <select
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="all">すべてのレアリティ</option>
          <option value="あわ">あわ</option>
          <option value="しゅわ">しゅわ</option>
          <option value="ぷく">ぷく</option>
          <option value="ばぶ">ばぶ</option>
          <option value="まぼろし">まぼろし</option>
        </select>
        <select
          value={attributeFilter}
          onChange={(e) => setAttributeFilter(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="all">すべての属性</option>
          <option value="火">火</option>
          <option value="水">水</option>
          <option value="木">木</option>
          <option value="光">光</option>
          <option value="闇">闇</option>
        </select>
      </div>

      {filteredCards.length === 0 ? (
        <p className="text-center text-gray-500">条件に合うカードがありません</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCards.map((card) => (
            <li key={card.id} className="border p-2 rounded shadow text-sm">
              {editingCardId === card.id ? (
                <div className="space-y-1">
                  <input name="name" value={editForm.name} onChange={handleChange} className="w-full border p-1 rounded" />
                  <div className="flex gap-2">
                    <input name="PP" type="number" value={editForm.PP} onChange={handleChange} className="w-1/3 border p-1 rounded" />
                    <input name="HP" type="number" value={editForm.HP} onChange={handleChange} className="w-1/3 border p-1 rounded" />
                    <input name="AP" type="number" value={editForm.AP} onChange={handleChange} className="w-1/3 border p-1 rounded" />
                  </div>
                  <input name="ability1" value={editForm.ability1 || ""} onChange={handleChange} className="w-full border p-1 rounded" placeholder="アビリティ1" />
                  <input name="ability2" value={editForm.ability2 || ""} onChange={handleChange} className="w-full border p-1 rounded" placeholder="アビリティ2" />
                  <input name="voiceLine" value={editForm.voiceLine || ""} onChange={handleChange} className="w-full border p-1 rounded" placeholder="セリフ" />
                  <select
                    name="rarity"
                    value={editForm.rarity}
                    onChange={handleChange}
                    className="w-full border p-1 rounded"
                  >
                    <option value="あわ">あわ</option>
                    <option value="しゅわ">しゅわ</option>
                    <option value="ぷく">ぷく</option>
                    <option value="ばぶ">ばぶ</option>
                    <option value="まぼろし">まぼろし</option>
                  </select>

                  <input name="image" value={editForm.image || ""} onChange={handleChange} className="w-full border p-1 rounded" placeholder="画像URL" />
                  <input name="attribute" value={editForm.attribute || ""} onChange={handleChange} className="w-full border p-1 rounded" placeholder="属性" />
                  <div className="flex gap-2 justify-end">
                    <button onClick={saveEdit} className="px-2 py-1 bg-blue-500 text-white rounded">保存</button>
                    <button onClick={cancelEditing} className="px-2 py-1 bg-gray-300 rounded">キャンセル</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div><strong>{card.name}</strong>（{card.rarity} / {card.attribute}）</div>
                  <div>PP: {card.PP} / HP: {card.HP} / AP: {card.AP}</div>
                  <div>アビリティ1: {card.ability1}</div>
                  <div>アビリティ2: {card.ability2}</div>
                  <div>セリフ: {card.voiceLine}</div>
                  {card.image && <img src={card.image} alt={card.name} className="mt-1 w-full h-auto object-cover" />}
                  <div className="flex gap-2 justify-end mt-2">
                    <button onClick={() => startEditing(card)} className="px-2 py-1 bg-yellow-500 text-white rounded">編集</button>
                    <button onClick={() => deleteCard(card.id)} className="px-2 py-1 bg-red-500 text-white rounded">削除</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default CardList;
