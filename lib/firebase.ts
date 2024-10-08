import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCx2v3h8DqqEWuOiDc8gUMiy94Dul-WPx8",
  authDomain: "chadey-d7590.firebaseapp.com",
  databaseURL: "https://chadey-d7590-default-rtdb.firebaseio.com",
  projectId: "chadey-d7590",
  storageBucket: "chadey-d7590.appspot.com",
  messagingSenderId: "114766990368",
  appId: "1:114766990368:web:81028c6696b0aa55bb4045",
  measurementId: "G-F07EDCJYVP"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const db = getFirestore();