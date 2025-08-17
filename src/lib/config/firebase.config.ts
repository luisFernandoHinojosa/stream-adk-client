import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
	apiKey: 'AIzaSyCQZ1F6qQFmGVsfVLz0Q8k4Kn_HTiHcTzQ',
	authDomain: 'adk-487a9.firebaseapp.com',
	projectId: 'adk-487a9',
	storageBucket: 'adk-487a9.firebasestorage.app',
	messagingSenderId: '139912055027',
	appId: '1:139912055027:web:95876f89a6f87fc2544f86'
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
