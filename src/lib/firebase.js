import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "chatapp-f0b9b.firebaseapp.com",
  databaseURL: "https://chatapp-f0b9b-default-rtdb.firebaseio.com",
  projectId: "chatapp-f0b9b",
  storageBucket: "chatapp-f0b9b.appspot.com",
  messagingSenderId: "119113541480",
  appId: "1:119113541480:web:d549d905b55ea7996b18dd",
  measurementId: "G-09PHQP5LNL"
};
const app = initializeApp(firebaseConfig); 

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()