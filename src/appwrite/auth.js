import conf from '../config/conf.js'
import { Client, Account, ID } from 'appwrite'

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.account = new Account(this.client);
    }

    async createAccount({ email, password, name }) {
        try {
            return await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
        } catch (err) {
            throw err;
        }
    }

    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (err) {
            throw err;
        }
    }

    
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser :: ", error);
            return null;
        }
    }

    async logout() {
        try {
            return await this.account.deleteSession("current");
        } catch (err) {
            throw err;
        }
    }
}

const authService = new AuthService();

export default authService;
