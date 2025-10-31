import { UserRepository } from "@/domain/interfaces/user.interface";
import { CacheService } from "@/infra/cache/cache.service";
import { database } from "@/firebaseConfig";
import { get, ref, update } from "firebase/database";

const isWeb = typeof document !== "undefined";
const LOCAL_IP = "201.68.150.178";
const BASE_URL = isWeb ? "http://localhost:4000" : `http://${LOCAL_IP}:4000`;

export class UserRepositoryImpl implements UserRepository{

    async getUserById(id: string): Promise<any | null> {
            const cacheKey = `user_${id}`;
            
              try {
                const cached = await CacheService.get(cacheKey);
                if (cached) return cached;
            
                const response = await get(ref(database, `profiles/${id}`));
                if (response.exists()) {
                  const data = response.val();
                  await CacheService.set(cacheKey, data);
                  return data;
                }
              } catch (error) {
                console.error("[API] getUserById erro:", error);
              }
              return null;
        }
    async getusers(): Promise<any> {
        const cacheKey = "users_all";
        
          try {
            const cached = await CacheService.get(cacheKey);
            if (cached) return cached;
        
            const response = await fetch(`${BASE_URL}/usuarios`);
            const data = await response.json();
            await CacheService.set(cacheKey, data);
            return data;
          } catch (error) {
            console.error("[API] getUsers erro:", error);
            throw error;
          }
    }
    async createUser(userData: any): Promise<Response> {
        try {
            await CacheService.clear("users_all");
            return await fetch(`${BASE_URL}/usuarios`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(userData),
            });
          } catch (error) {
            console.error("[API] createUser erro:", error);
            throw error;
          }
    }
    async getAccountUserById(id: string): Promise<any | null> {
            const cacheKey = `account_${id}`;
              try {
                const cached = await CacheService.get(cacheKey);
                if (cached) return cached;
            
                const response = await fetch(`${BASE_URL}/contas?id=${id}`);
                if (response.ok) {
                  const accounts = await response.json();
                  const account = accounts[0] || null;
                  if (account) await CacheService.set(cacheKey, account);
                  return account;
                }
              } catch (error) {
                console.error("[API] getAccountUserById erro:", error);
              }
              return null;
        }
    async updateAccountById(id: string, userData: any): Promise<boolean> {
        try {
            // Atualiza a conta no banco de dados (Firebase)
            await update(ref(database, `profiles/${id}`), {
              conta: {
                saldo: userData.saldo ?? 0,
                extrato: userData.extrato ?? [],
              },
            });
        
            // Atualiza cache específico da conta
            await CacheService.set(`account_${id}`, userData);
        
            // *** Correção do bug ***
            // Limpa o cache do usuário para garantir que o próximo getUserById traga os dados atualizados.
            await CacheService.clear(`user_${id}`);
        
            // Mantém limpeza da lista geral de usuários
            await CacheService.clear("users_all");
        
            console.log(`💾 [API] Conta \"${id}\" atualizada e cache sincronizado`);
            return true;
          } catch (error) {
            console.error("[API] updateAccountById erro:", error);
            return false;
          }
    }
}