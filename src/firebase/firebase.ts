import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyDOyqL_952EHCoCXjZFFe9EeICHg0pCHOA',
  authDomain: 'delish-one-week.firebaseapp.com',
  databaseURL: 'https://delish-one-week.firebaseio.com',
  projectId: 'delish-one-week',
  storageBucket: 'delish-one-week.appspot.com',
  messagingSenderId: '195226844177',
  appId: '1:195226844177:web:f028875248a1a9e473c5b0',
  measurementId: 'G-H29JKBL0FR',
};

firebase.initializeApp(firebaseConfig);

export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const fireStore = firebase.firestore();

export default firebase;
