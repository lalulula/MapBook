// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyDwhXeAI7FonbfTlwkAyzTX2PBO2OuGRzo",
    authDomain: "mapbook-6abbc.firebaseapp.com",
    projectId: "mapbook-6abbc",
    storageBucket: "mapbook-6abbc.appspot.com",
    messagingSenderId: "701704312981",
    appId: "1:701704312981:web:e54b44ae54d23b014d239c",
    measurementId: "G-5JP9M3FK21"
};

// Initialize Firebase
const fb = initializeApp(firebaseConfig);
const storage = getStorage(fb)


export { fb, storage };
