import { get, set, ref, update } from "firebase/database";
import { database } from "../firebaseConfig";
import { CacheService } from "./cache.service";

const isWeb = typeof document !== "undefined";
const LOCAL_IP = "187.34.127.18";
const BASE_URL = isWeb ? "http://localhost:4000" : `http://${LOCAL_IP}:4000`;

// 🔹 Usuários
export async function getUserById(id: string): Promise<any | null> {
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

export async function getUsers(): Promise<any> {
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

export async function createUser(data: any): Promise<Response> {
  try {
    await CacheService.clear("users_all");
    return await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error("[API] createUser erro:", error);
    throw error;
  }
}

// 🔹 Contas
export async function getAccountUserById(id: string): Promise<any | null> {
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

export async function updateAccountById(id: string, account: any): Promise<boolean> {
  try {
    // Atualiza a conta no banco de dados (Firebase)
    await update(ref(database, `profiles/${id}`), {
      conta: {
        saldo: account.saldo ?? 0,
        extrato: account.extrato ?? [],
      },
    });

    // Atualiza cache específico da conta
    await CacheService.set(`account_${id}`, account);

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


export async function createProfile(profile: any): Promise<boolean> {
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
