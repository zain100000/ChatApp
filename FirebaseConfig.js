import firebase from 'firebase/compat';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBcWLJRRRINwNqCYvcv0T3tu0d2dRgl_Nw',
  authDomain: 'chatapp-9f45f.firebaseapp.com',
  projectId: 'chatapp-9f45f',
  storageBucket: 'chatapp-9f45f.appspot.com',
  messagingSenderId: '431947523732',
  appId: '1:431947523732:web:192228ff2028c0501df681',
  measurementId: 'G-K145Q839VC',
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const database = firebase.database();

export const roles = {
  user: 'User',
};
