import conf from '../config/conf.js';
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

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.error('Appwrite service :: getPost() :: ', error);
      return false;
    }
  }

  async getPosts(queries = [Query.equal('status', 'active')]) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.error('Appwrite service :: getPosts() :: ', error);
      return false;
    }
  }

  async createPost({ title, slug, content, featuredimage, status }) {
    try {
      const user = await this.account.get();
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug || ID.unique(),
        {
          title,
          content,
          featuredimage,
          status,
          userid: user.$id, // ✅ must match Appwrite collection field
        }
      );
    } catch (error) {
      console.error('Appwrite service :: createPost() :: ', error);
      return false;
    }
  }

  async updatePost(slug, { title, content, featuredimage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredimage,
          status,
        }
      );
    } catch (error) {
      console.error('Appwrite service :: updatePost() :: ', error);
      return false;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.error('Appwrite service :: deletePost() :: ', error);
      return false;
    }
  }

  // ================= STORAGE =================

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(conf.appwriteBucketId, ID.unique(), file);
    } catch (error) {
      console.error('Appwrite service :: uploadFile() :: ', error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.error('Appwrite service :: deleteFile() :: ', error);
      return false;
    }
  }

  async getFilePreview(fileId) {
    try {
      const preview = await this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
      return preview.href;
    } catch (error) {
      console.error('Appwrite service :: getFilePreview() :: ', error);
      return '';
    }
  }
}

const service = new Service();
export default service;
