/* eslint-disable jsx-a11y/href-no-hash */
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
var firebaseConfig = {
    apiKey: "AIzaSyAPMRdtvVrdMWgY-6lXXEMjC6AgDEroNK0",
    authDomain: "awsomechat-8828f.firebaseapp.com",
    databaseURL: "https://awsomechat-8828f.firebaseio.com",
    projectId: "awsomechat-8828f",
    storageBucket: "awsomechat-8828f.appspot.com",
    messagingSenderId: "146340850676",
    appId: "1:146340850676:web:5c77bdca14819407"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;