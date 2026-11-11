import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import {getFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAxcrdnv2QXQA2qb-hvn88__rXKmtW4owY",
  authDomain: "trilhamestre-fc306.firebaseapp.com",
  projectId: "trilhamestre-fc306",
  storageBucket: "trilhamestre-fc306.firebasestorage.app",
  messagingSenderId: "261476649416",
  appId: "1:261476649416:web:ccce2362c6c75315e8d8fd",
  measurementId: "G-5RWP1675S2"
};

export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey
  && firebaseConfig.authDomain
  && firebaseConfig.projectId
  && firebaseConfig.appId
  && firebaseConfig.messagingSenderId
);

const app = firebaseConfigurado
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

function criarAuth() {
  if (!app) return null;

  try {
    const instancia = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
    instancia.languageCode = 'pt-BR';
    return instancia;
  } catch (error) {
    if (error.code === 'auth/already-initialized') {
      const instancia = getAuth(app);
      instancia.languageCode = 'pt-BR';
      return instancia;
    }
    throw error;
  }
}

export const auth = criarAuth();
export const funcoes = app ? getFunctions(app, 'us-central1') : null;
