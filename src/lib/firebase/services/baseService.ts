import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  QueryConstraint 
} from 'firebase/firestore';
import { db, auth } from '../config';

export class BaseFirestoreService {
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected async create<T extends { id?: string }>(data: Omit<T, 'id' | 'created_at' | 'updated_at'>): Promise<T> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    });
    
    const newDoc = await getDoc(docRef);
    return {
      id: docRef.id,
      ...newDoc.data()
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
      updated_at: serverTimestamp()
    });

    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) return null;
    
    return { id: updatedDoc.id, ...updatedDoc.data() } as T;
  }

  protected async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  protected async verifyAuth() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated');
    }
    return user;
  }

  protected async verifyUserProfile() {
    const user = await this.verifyAuth();
    const userDoc = await this.get(user.uid);
    if (!userDoc) {
      throw new Error('User profile not found');
    }
    return userDoc;
  }

  protected createQuery(
    conditions: Array<{field: string; operator: string; value: any}> = [],
    sortField?: string,
    sortDirection: 'asc' | 'desc' = 'desc'
  ): QueryConstraint[] {
    const constraints: QueryConstraint[] = [];
    
    conditions.forEach(({ field, operator, value }) => {
      constraints.push(where(field, operator, value));
    });

    if (sortField) {
      constraints.push(orderBy(sortField, sortDirection));
    }

    return constraints;
  }
}