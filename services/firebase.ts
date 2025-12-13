
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuration keys hardcoded as requested by the user for ease of deployment.
// Note: In a public repository, it is generally recommended to use environment variables/secrets.
// However, Firebase API keys are designed to be safe to expose in client-side code
// provided Firestore Security Rules are configured correctly in the Firebase Console.

const firebaseConfig = {
  apiKey: "AIzaSyBAsJ4V-QT_NCdDFLxmqloJnPetA8Z_0zs",
  authDomain: "site-sustentabilidade.firebaseapp.com",
  projectId: "site-sustentabilidade",
  storageBucket: "site-sustentabilidade.firebasestorage.app",
  messagingSenderId: "909794812502",
  appId: "1:909794812502:web:d53138d740109fa95a11f7",
  measurementId: "G-R6WQ9MH8FD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
