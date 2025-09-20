import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDnW50yjywSxjEeVoeB39Rp-P9PpcQpTW0",
  authDomain: "bhadlikavya.firebaseapp.com",
  projectId: "bhadlikavya",
  storageBucket: "bhadlikavya.firebasestorage.app",
  messagingSenderId: "294278448709",
  appId: "1:294278448709:web:b12e9d39df609c438f452c",
  measurementId: "G-P56Y5GTTS7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;


// 294278448709-kvh5mc6fdau0dktqmb4cglkjecmrfko0.apps.googleusercontent.com - web client id