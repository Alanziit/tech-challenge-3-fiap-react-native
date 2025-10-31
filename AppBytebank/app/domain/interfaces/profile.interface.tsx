export interface ProfileRepository {
    createProfile(profile: any): Promise<boolean>;
}