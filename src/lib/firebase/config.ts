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

type FirebaseEnv = 'production' | 'development';

const STORAGE_KEY = 'aidus.firebaseEnv';

function getSelectedEnv(): FirebaseEnv {
  const defaultEnv = (process.env.NEXT_PUBLIC_FIREBASE_ENV as FirebaseEnv | undefined) ?? 'production';

  if (typeof window === 'undefined') return defaultEnv;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'production' || saved === 'development') return saved;
  return defaultEnv;
}

type EnvConfig = {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  envVarNames: Record<keyof FirebaseConfig, string>;
};

function getEnvConfig(env: FirebaseEnv): EnvConfig {
  const prod = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PROD_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_PROD_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROD_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_PROD_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_PROD_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_PROD_APP_ID,
    envVarNames: {
      apiKey: 'NEXT_PUBLIC_FIREBASE_PROD_API_KEY',
      authDomain: 'NEXT_PUBLIC_FIREBASE_PROD_AUTH_DOMAIN',
      projectId: 'NEXT_PUBLIC_FIREBASE_PROD_PROJECT_ID',
      storageBucket: 'NEXT_PUBLIC_FIREBASE_PROD_STORAGE_BUCKET',
      messagingSenderId: 'NEXT_PUBLIC_FIREBASE_PROD_MESSAGING_SENDER_ID',
      appId: 'NEXT_PUBLIC_FIREBASE_PROD_APP_ID',
    },
  } satisfies EnvConfig;

  const dev = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_DEV_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_DEV_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_DEV_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_DEV_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_DEV_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_DEV_APP_ID,
    envVarNames: {
      apiKey: 'NEXT_PUBLIC_FIREBASE_DEV_API_KEY',
      authDomain: 'NEXT_PUBLIC_FIREBASE_DEV_AUTH_DOMAIN',
      projectId: 'NEXT_PUBLIC_FIREBASE_DEV_PROJECT_ID',
      storageBucket: 'NEXT_PUBLIC_FIREBASE_DEV_STORAGE_BUCKET',
      messagingSenderId: 'NEXT_PUBLIC_FIREBASE_DEV_MESSAGING_SENDER_ID',
      appId: 'NEXT_PUBLIC_FIREBASE_DEV_APP_ID',
    },
  } satisfies EnvConfig;

  return env === 'production' ? prod : dev;
}

const selectedEnv = getSelectedEnv();
const { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, envVarNames } = getEnvConfig(selectedEnv);

// Validate required environment variables
const requiredEnvVars = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

const requiredEnvVarNames: Record<keyof typeof requiredEnvVars, string> = {
  apiKey: envVarNames.apiKey,
  authDomain: envVarNames.authDomain,
  projectId: envVarNames.projectId,
  storageBucket: envVarNames.storageBucket,
  messagingSenderId: envVarNames.messagingSenderId,
  appId: envVarNames.appId,
};

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value || value.trim() === '')
  .map(([key]) => requiredEnvVarNames[key as keyof typeof requiredEnvVarNames]);

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
    // Name the app so switching env doesn't conflict during dev/HMR
    const appName = `aidus-${selectedEnv}`;
    const existing = getApps().find((a) => a.name === appName);
    app = existing ?? initializeApp(firebaseConfig, appName);
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

export function getFirebaseEnv(): FirebaseEnv {
  return selectedEnv;
}

export function setFirebaseEnv(env: FirebaseEnv) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, env);
}