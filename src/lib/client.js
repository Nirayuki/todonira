import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDNtQWTPXmByXaChphEDR4GzjuiokNEdvQ",
    authDomain: "todo-typescript-d3fea.firebaseapp.com",
    projectId: "todo-typescript-d3fea",
    storageBucket: "todo-typescript-d3fea.appspot.com",
    messagingSenderId: "112581774859",
    appId: "1:112581774859:web:d7a33d09cfb69060f6810e",
    measurementId: "G-NNXYK35X8F"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const database = initializeFirestore(app, {
    experimentalForceLongPolling: true, // this line
    useFetchStreams: false, // and this line
  });
  
  export default database;