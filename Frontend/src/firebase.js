// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "cne-meet-default-rtdb.firebaseapp.com",
  databaseURL: "https://cne-meet-default-rtdb.firebaseio.com/",
  projectId: "cne-meet",
  storageBucket: "YOUR_BUCKET.appspot.com",
  messagingSenderId: "629412311207",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
