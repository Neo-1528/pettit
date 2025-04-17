
import { db } from './firebaseConfig';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

// 🔹カード一覧を取得（サブコレクション）
export const getOwnedCards = async () => {
  const user = getAuth().currentUser;
  if (!user) throw new Error('ユーザーがログインしていません');

  const ref = collection(db, 'users', user.uid, 'ownedCards');
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// 🔹ガチャで引いたカードを保存（同じIDも複数保存OK）
export const saveDrawnCards = async (drawnCards) => {
  const user = getAuth().currentUser;
  if (!user) {
    console.error('ユーザーがログインしていません');
    return;
  }

  const uid = user.uid;
  const ref = collection(db, 'users', uid, 'ownedCards');

  try {
    for (const card of drawnCards) {
      await addDoc(ref, {
        id: card.id,
        obtainedAt: new Date().toISOString(),
        ...card,
      });
    }
    console.log('ガチャカードの保存が完了しました（複数対応）');
  } catch (error) {
    console.error('カード保存時にエラーが発生:', error);
  }
};
