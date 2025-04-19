
import { db } from './firebaseConfig';
import { collection, doc, getDocs, deleteDoc, addDoc } from 'firebase/firestore';


export const getDecks = async (uid) => {
  const q = collection(db, 'users', uid,'decks');
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createDeck = async (uid) => {
  const docRef = await addDoc(collection(db, 'users', uid, 'decks'), {
    name: '新しいデッキ',
    cards: [],
    createdAt: Date.now()
  });
  return docRef.id;
};

export const deleteDeck = async (uid, id) => {
  await deleteDoc(doc(db, 'users', uid, 'decks', id));
};
