import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBEZRB6J1DhyVKdeLwDbD5T6amVN65xryA",
    authDomain: "puchi-bottle-batle.firebaseapp.com",
    projectId: "puchi-bottle-batle",
    storageBucket: "puchi-bottle-batle.firebasestorage.app",
    messagingSenderId: "48895564053",
    appId: "1:48895564053:web:c684c597f1c651796bb11c"
  };

  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app);
  export const provider = new GoogleAuthProvider();
  export const db = getFirestore(app);