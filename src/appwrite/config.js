// Appwrite Service
import conf from '/src/config/conf.js';
import { Client, ID, Databases, Storage, Account, Query } from 'appwrite';

class Service {
  client = new Client();
  databases;
  bucket;
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
    this.account = new Account(this.client);
  }

  // ================= POSTS =================

  async getPost(documentId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentId
      );
    } catch (error) {
      console.error('Appwrite service :: getPost() :: ', error);
      return null;
    }
  }

  async getPosts(queries = []) {
    try {
      const res = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
      return res.documents || [];
    } catch (error) {
      console.error('Appwrite service :: getPosts() :: ', error);
      return [];
    }
  }

  async createPost({ title, slug, content, featuredimage, status }) {
    try {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('User not logged in');

      const documentId = slug
        ? slug.replace(/[^a-zA-Z0-9_-]/g, '_')
        : ID.unique();

      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentId,
        {
          title,
          content,
          status: status || 'draft',
          userid: user.$id,
          featuredimage: featuredimage || null, // ✅ lowercase
        }
      );
    } catch (error) {
      console.error('Appwrite service :: createPost() :: ', error);
      return null;
    }
  }

  async updatePost(documentId, { title, content, featuredimage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentId,
        {
          title,
          content,
          status,
          featuredimage: featuredimage || null, // ✅ lowercase
        }
      );
    } catch (error) {
      console.error('Appwrite service :: updatePost() :: ', error);
      return null;
    }
  }

  async deletePost(documentId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentId
      );
      return true;
    } catch (error) {
      console.error('Appwrite service :: deletePost() :: ', error);
      return false;
    }
  }

  // ================= STORAGE =================

  async uploadFile(file) {
    if (!file) {
      console.error("uploadFile() :: No file provided");
      return null;
    }
    try {
      return await this.bucket.createFile(conf.appwriteBucketId, ID.unique(), file);
    } catch (error) {
      console.error('Appwrite service :: uploadFile() :: ', error);
      return null;
    }
  }

  async deleteFile(fileId) {
    if (!fileId) return false;
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error('Appwrite service :: deleteFile() :: ', error);
      return false;
    }
  }

  async getFilePreview(fileId) {
    if (!fileId) return '';
    try {
      const preview = await this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
      return preview.href || '';
    } catch (error) {
      console.error('Appwrite service :: getFilePreview() :: ', error);
      return '';
    }
  }

  // ================= AUTH HELPERS =================

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      if (error.code !== 401) console.log('Appwrite service :: getCurrentUser() :: ', error);
      return null;
    }
  }
}

const service = new Service();
export default service;
