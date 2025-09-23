import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCkeCJcFOd6uDv7wmLiEDNQYFdO8kPFIOg',
  authDomain: 'com.techallenge3.bytebank',
  projectId: 'tech-challange-3-fiap',
  storageBucket: 'tech-challange-3-fiap.firebasestorage.app',
  messagingSenderId: '578214590420',
  appId: '1:578214590420:android:7034bcf538ba94af6d4841',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
