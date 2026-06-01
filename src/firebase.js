import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCdjodf-t_ST5io-65WtwMABt1b6bA-bi0",
  authDomain: "srg-monitor.firebaseapp.com",
  projectId: "srg-monitor",
  storageBucket: "srg-monitor.firebasestorage.app",
  messagingSenderId: "1070246785598",
  appId: "1:1070246785598:web:29177b930ea931c3ca576f",
  measurementId: "G-D5QV16TR79"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Define which emails have editor/admin access
// All other logged-in users are viewers only
export const EDITOR_EMAILS = [
  'fitri.sitanggang@gmail.com',
  
];

export const isEditor = (email) => {
  return EDITOR_EMAILS.includes(email?.toLowerCase());
};
