// start with appwrite auth service
import conf from "../config/conf.js"
import { Client, Account, ID } from "appwrite";

export class AuthService {
    client = new Client();
    account;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)        // Your Appwrite endpoint
            .setProject(conf.appwriteProjectId)   // Your project ID
        this.account = new Account(this.client);
    }

    // ✅ Create new account
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await this.account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Auto login after signup
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    // ✅ Login (new SDK method)
    async login({ email, password }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    // ✅ Get current logged-in user
    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            console.log("Appwrite service :: getCurrentUser() :: ", error);
            return null;
        }
    }

    // ✅ Logout user
    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite service :: logout() :: ", error);
        }
    }
}

const authService = new AuthService();
export default authService;
