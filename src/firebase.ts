// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcsGyUyJc9ZaC99pUqHGtEoHuWPz-CgfE",
  authDomain: "finalproject-c8aae.firebaseapp.com",
  projectId: "finalproject-c8aae",
  storageBucket: "finalproject-c8aae.appspot.com",
  messagingSenderId: "833565377114",
  appId: "1:833565377114:web:29f099485dbd15c5350e63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);