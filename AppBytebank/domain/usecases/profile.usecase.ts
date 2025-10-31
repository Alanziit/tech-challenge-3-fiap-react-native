import { ProfileRepository } from "../interfaces/profile.interface";

export class ProfileUsecase {
    
    constructor(private readonly _profileRepository: ProfileRepository) {}

    async createProfile(profile: any): Promise<boolean> {
        return this._profileRepository.createProfile(profile);
    }
    
} 