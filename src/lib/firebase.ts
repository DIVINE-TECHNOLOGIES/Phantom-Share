import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Firestore with custom database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test Firestore Connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode or waiting for connection.');
    }
  }
}
testFirestoreConnection();

// Auth Methods
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    // Sync user profile to Firestore
    await syncUserProfile(user);
    return user;
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function registerWithEmail(email: string, pass: string, name: string) {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  if (name) {
    await updateProfile(result.user, { displayName: name });
  }
  await syncUserProfile(result.user);
  return result.user;
}

export async function loginWithEmail(email: string, pass: string) {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  await syncUserProfile(result.user);
  return result.user;
}

export async function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  return signOut(auth);
}

// User Profile Sync
export async function syncUserProfile(user: User) {
  if (!user || !user.uid) return;
  try {
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'User',
      photoURL: user.photoURL || '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Could not sync user profile to Firestore:', err);
  }
}

// User Vault Documents Sync
export async function saveFileToCloudVault(userId: string, fileData: any) {
  if (!userId || !fileData?.id) return;
  const fileRef = doc(db, 'users', userId, 'files', fileData.id);
  await setDoc(fileRef, {
    ...fileData,
    userId,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteFileFromCloudVault(userId: string, fileId: string) {
  if (!userId || !fileId) return;
  const fileRef = doc(db, 'users', userId, 'files', fileId);
  await deleteDoc(fileRef);
}

// User Conversion History Sync
export async function saveConversionToCloud(userId: string, conversionData: any) {
  if (!userId || !conversionData?.id) return;
  const convRef = doc(db, 'users', userId, 'conversions', conversionData.id);
  await setDoc(convRef, {
    ...conversionData,
    userId,
    updatedAt: new Date().toISOString()
  });
}
