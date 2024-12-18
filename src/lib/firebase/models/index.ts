import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config';
import { COLLECTIONS } from '../collections';

export const createDocument = async (collectionName: string, data: any) => {
  const docRef = await addDoc(collection(db, collectionName), {
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  return { id: docRef.id, ...data };
};

export const getDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updated_at: new Date().toISOString()
  });
  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...updatedDoc.data() };
};

export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
  return true;
};

export const queryDocuments = async (
  collectionName: string,
  conditions: { field: string; operator: any; value: any }[] = [],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc'
) => {
  let q = collection(db, collectionName);

  if (conditions.length > 0) {
    q = query(q, ...conditions.map(c => where(c.field, c.operator, c.value)));
  }

  if (orderByField) {
    q = query(q, orderBy(orderByField, orderDirection));
  }

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};