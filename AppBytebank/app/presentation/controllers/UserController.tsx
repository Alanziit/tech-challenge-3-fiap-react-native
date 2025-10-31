import { UserUsecase } from "@/app/domain/usecases/user.usecase";

export class UserController {

    constructor(private readonly _userUsecase: UserUsecase) {}

    async getUserById(id: string): Promise<any | null> {
        return await this._userUsecase.getUserById(id);
    }

    async getusers(): Promise<any>{
        return await this._userUsecase.getusers();
    }

    async createUser(userData: any): Promise<Response>{
        return await this._userUsecase.createUser(userData);
    }

    async getAccountUserById(id: string): Promise<any | null> {
        return await this._userUsecase.getAccountUserById(id);
    }

    async updateAccountById(id: string, userData: any): Promise<boolean> {
        return await this._userUsecase.updateAccountById(id, userData);
    }
}