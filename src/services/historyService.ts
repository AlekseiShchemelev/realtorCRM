// src/services/historyService.ts
import { collection, addDoc, getDocs, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';
import type { HistoryEntry } from '../types';

interface HistoryEntryInput {
  clientId: string;
  action: HistoryEntry['action'];
  details?: string;
}

const historyCollection = collection(db, 'history');

const getCurrentUserId = () => {
  return auth.currentUser?.uid;
};

export const getHistory = async (): Promise<HistoryEntry[]> => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const q = query(
    historyCollection,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HistoryEntry));
};

export const addHistoryEntry = async (entry: HistoryEntryInput) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Пользователь не авторизован');

  await addDoc(historyCollection, {
    ...entry,
    userId,
    timestamp: new Date().toISOString(),
  });
};

export const clearHistory = async () => {
  const userId = getCurrentUserId();
  if (!userId) return;

  const q = query(historyCollection, where('userId', '==', userId));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};