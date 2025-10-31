import { ProfileRepository } from "@/app/domain/interfaces/profile.interface";
import { CacheService } from "@/app/infra/cache/cache.service";
import { database } from "@/firebaseConfig";
import { ref, set } from "firebase/database";

export class ProfileRepositoryImpl implements ProfileRepository {
    async createProfile(profile: any): Promise<boolean> {
        try {
            await set(ref(database, `profiles/${profile.id}`), { 
              nome: profile.userName,
              dataCriacao: profile.dataCriacao.toString(),
              conta: profile.conta ?? { saldo: 0, extrato: [] },
            });
        
            await CacheService.set(`user_${profile.id}`, profile);
            await CacheService.clear("users_all");
            console.log(`💾 [API] Perfil "${profile.id}" criado e cache atualizado`);
            return true;
          } catch (error) {
            console.error("[API] createAccount erro:", error);
            return false;
          }
    }
}