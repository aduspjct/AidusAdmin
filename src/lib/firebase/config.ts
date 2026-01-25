import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Get environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Validate required environment variables
const requiredEnvVars = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

const envVarNames: Record<keyof typeof requiredEnvVars, string> = {
  apiKey: 'NEXT_PUBLIC_FIREBASE_API_KEY',
  authDomain: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  projectId: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  storageBucket: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'NEXT_PUBLIC_FIREBASE_APP_ID',
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value || value.trim() === '')
  .map(([key]) => envVarNames[key as keyof typeof envVarNames]);

if (missingVars.length > 0) {
  const errorMessage = `
⚠️  Firebase Configuration Error

Missing or empty environment variables:
${missingVars.map(v => `  - ${v}`).join('\n')}

Please create a .env.local file in the root directory with your Firebase configuration.
You can use env.example as a template.

Example:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
  `.trim();

  if (typeof window === 'undefined') {
    // Server-side: throw error
    throw new Error(errorMessage);
  } else {
    // Client-side: log error
    console.error(errorMessage);
  }
}

const firebaseConfig: FirebaseConfig = {
  apiKey: apiKey || '',
  authDomain: authDomain || '',
  projectId: projectId || '',
  storageBucket: storageBucket || '',
  messagingSenderId: messagingSenderId || '',
  appId: appId || '',
};

// Initialize Firebase only if config is valid
let app: FirebaseApp | null = null;

if (missingVars.length === 0) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw new Error(
      'Failed to initialize Firebase. Please check your configuration and ensure all environment variables are set correctly.'
    );
  }
}

// Initialize Firebase services only if app is initialized
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
export const storage: FirebaseStorage | null = app ? getStorage(app) : null;

export default app;

