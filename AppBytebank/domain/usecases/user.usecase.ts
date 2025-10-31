import { UserRepository } from "../interfaces/user.interface";


export class UserUsecase {

    constructor(private readonly _userRepository: UserRepository) {}

    async getUserById(id: string): Promise<any | null> {
        return await this._userRepository.getUserById(id);
    }

    async getusers(): Promise<any>{
        return await this._userRepository.getusers();
    }

    async createUser(userData: any): Promise<Response>{
        return await this._userRepository.createUser(userData);
    }

    async getAccountUserById(id: string): Promise<any | null> {
        return await this._userRepository.getAccountUserById(id);
    }

    async updateAccountById(id: string, userData: any): Promise<boolean> {
        return await this._userRepository.updateAccountById(id, userData);
    }
    

    
}