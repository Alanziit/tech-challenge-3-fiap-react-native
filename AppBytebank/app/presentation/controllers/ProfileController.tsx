import { ProfileUsecase } from "@/app/domain/usecases/profile.usecase";

export class ProfileConstroller {
    
    constructor(private readonly _profileUsecase: ProfileUsecase) {}
    
    async createProfile(profile: any): Promise<boolean> {
        return this._profileUsecase.createProfile(profile);
    }
}