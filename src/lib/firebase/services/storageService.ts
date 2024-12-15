import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '../config';

export const storageService = {
  // Upload a file to Firebase Storage
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get download URL for a file
  async getFileUrl(path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error('Error getting file URL:', error);
      throw error;
    }
  },

  // Delete a file from Firebase Storage
  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  },

  // List all files in a directory
  async listFiles(path: string): Promise<{ name: string; url: string }[]> {
    try {
      const storageRef = ref(storage, path);
      const res = await listAll(storageRef);
      
      const files = await Promise.all(
        res.items.map(async (itemRef) => ({
          name: itemRef.name,
          url: await getDownloadURL(itemRef)
        }))
      );
      
      return files;
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  },

  // Generate a unique file path
  generatePath(directory: string, fileName: string): string {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = fileName.split('.').pop();
    return `${directory}/${timestamp}-${randomString}.${extension}`;
  }
};
