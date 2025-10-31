import { ProfileRepositoryImpl } from "@/data/repository/profile.repository";
import { ProfileUsecase } from "@/domain/usecases/profile.usecase";

export class ProfileConstroller {

    private readonly _profileUsecase: ProfileUsecase;
    
    constructor() {
        const profileRepository = new ProfileRepositoryImpl();
        this._profileUsecase = new ProfileUsecase(profileRepository);
    }
    
    async createProfile(profile: any): Promise<boolean> {
        return this._profileUsecase.createProfile(profile);
    }
}