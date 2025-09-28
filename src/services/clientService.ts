// src/services/clientService.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { auth } from './firebase';
import type { Client } from '../types';

const clientsCollection = collection(db, 'clients');

const getCurrentUserId = () => {
  return auth.currentUser?.uid;
};

export const getClients = async (): Promise<Client[]> => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const q = query(clientsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Client));
};

export const addClient = async (client: Omit<Client, 'id' | 'createdAt'>): Promise<string> => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Пользователь не авторизован');

  const docRef = await addDoc(clientsCollection, {
    ...client,
    userId,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const updateClient = async (id: string, updates: Partial<Client>) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Пользователь не авторизован');

  const clientDoc = doc(db, 'clients', id);
  // Дополнительно можно проверить, что документ принадлежит пользователю
  await updateDoc(clientDoc, updates);
};

export const deleteClient = async (id: string) => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('Пользователь не авторизован');

  const clientDoc = doc(db, 'clients', id);
  await deleteDoc(clientDoc);
};

/**
 * Возвращает клиентов, у которых встреча в указанный день.
 */
export const getClientsByDate = async (date: Date): Promise<Client[]> => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const formatDateForQuery = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const startStr = formatDateForQuery(startOfDay);
  const endStr = formatDateForQuery(endOfDay);

  const q = query(
    clientsCollection,
    where('userId', '==', userId),
    where('meetingDate', '>=', startStr),
    where('meetingDate', '<=', endStr),
    orderBy('meetingDate')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Client));
};