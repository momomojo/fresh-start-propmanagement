import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../config';
import type { QueryConstraint } from 'firebase/firestore';

export class BaseFirestoreService {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected async create<T extends { id?: string }>(data: Omit<T, 'id'>): Promise<T> {
    const timestamp = new Date().toISOString();
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      created_at: timestamp,
      updated_at: timestamp
    });
    
    return {
      id: docRef.id,
      ...data,
      created_at: timestamp,
      updated_at: timestamp
    } as T;
  }

  protected async get<T extends { id: string }>(id: string): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    return { id: docSnap.id, ...docSnap.data() } as T;
  }

  protected async list<T extends { id: string }>(
    constraints: QueryConstraint[] = []
  ): Promise<T[]> {
    const q = query(collection(db, this.collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as T[];
  }

  protected async update<T extends { id: string }>(
    id: string,
    data: Partial<T>
  ): Promise<T | null> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updated_at: new Date().toISOString()
    });

    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) return null;
    
    return { id: updatedDoc.id, ...updatedDoc.data() } as T;
  }

  protected async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }
}