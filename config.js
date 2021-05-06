import firebase from 'firebase';
require('@firebase/firestore')

 var firebaseConfig = {
    apiKey: "AIzaSyA3nMG3qN4IbAMFm317b8mdTLKJoGkYb3o",
    authDomain: "willy-b34a0.firebaseapp.com",
    projectId: "willy-b34a0",
    storageBucket: "willy-b34a0.appspot.com",
    messagingSenderId: "999524129265",
    appId: "1:999524129265:web:63a29560a8cf0afaff8c50"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
