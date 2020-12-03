// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import firebase from 'firebase';
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAOZCbGtQ4D1dINmt76b66E7kUaJe1rdeI",
    authDomain: "instagram-clone-react-84424.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-84424.firebaseio.com",
    projectId: "instagram-clone-react-84424",
    storageBucket: "instagram-clone-react-84424.appspot.com",
    messagingSenderId: "1041465423841",
    appId: "1:1041465423841:web:3782c10d4cf1becdb804a0",
    measurementId: "G-QGC5CX133G"
  });

  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db, auth, storage};