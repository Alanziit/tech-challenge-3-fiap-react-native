export interface UserRepository {
    getUserById(id: string): Promise<any | null>;
    getusers(): Promise<any>;
    createUser(userData: any): Promise<Response>;
    getAccountUserById(id: string): Promise<any | null>;
    updateAccountById(id: string, userData: any): Promise<boolean>;
}