import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKxDJX16QhlyAQTAPcIJA9vMu7iQoBvkU",
  authDomain: "to-do-list-487eb.firebaseapp.com",
  databaseURL: "https://to-do-list-487eb-default-rtdb.firebaseio.com",
  projectId: "to-do-list-487eb",
  storageBucket: "to-do-list-487eb.appspot.com",
  messagingSenderId: "1065774326348",
  appId: "1:1065774326348:web:23247f541b988bf7870ae9",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
