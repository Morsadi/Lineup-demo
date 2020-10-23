
import firebase from "firebase/app";
import 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyAmb78qrZcgJlyZtNsGW7-1uBsuBU4QI3M',
  authDomain: 'first1in.firebaseapp.com',
  databaseURL: 'https://first1in.firebaseio.com',
  projectId: 'first1in',
  storageBucket: 'first1in.appspot.com',
  messagingSenderId: '327976651796',
  appId: '1:327976651796:web:a7747d2454c900c9dd2b01',
  measurementId: 'G-2MZ87JCTRR',
};

const fire = firebase.initializeApp(firebaseConfig);

export default fire;