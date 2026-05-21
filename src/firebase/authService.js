import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './config';

export const registerUser = async (email, password, userData, role = 'user') => {
  try {
    await setPersistence(auth, browserLocalPersistence);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(
      doc(db, 'users', user.uid),
      {
        uid: user.uid,
        email: user.email,
        fullName: userData?.fullName ?? '',
        school: userData?.school ?? '',
        studentId: userData?.studentId ?? '',
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return user;
  } catch (error) {
    console.error('registerUser failed:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('loginUser failed:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('logoutUser failed:', error);
    throw error;
  }
};

const normalizeTimestamps = (data) => {
  const createdAt = data?.createdAt;
  const updatedAt = data?.updatedAt;

  return {
    ...data,
    createdAt: typeof createdAt?.toDate === 'function' ? createdAt.toDate() : createdAt ?? null,
    updatedAt: typeof updatedAt?.toDate === 'function' ? updatedAt.toDate() : updatedAt ?? null,
  };
};

export const getCurrentUser = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return null;
    return normalizeTimestamps(userDoc.data());
  } catch (error) {
    console.error('getCurrentUser failed:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map((snap) => normalizeTimestamps(snap.data()));
  } catch (error) {
    console.error('getAllUsers failed:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid, updates) => {
  try {
    await setDoc(
      doc(db, 'users', uid),
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('updateUserProfile failed:', error);
    throw error;
  }
};
