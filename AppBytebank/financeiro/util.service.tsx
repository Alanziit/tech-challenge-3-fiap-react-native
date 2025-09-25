import { get, set,ref, update } from "firebase/database";
import { database } from "../context/firebaseConfig";

// api.ts
// Base URL para web e mobile
const isWeb = typeof document !== "undefined";
const LOCAL_IP = "192.168.1.17"; // IP da sua máquina na rede
const BASE_URL = isWeb ? "http://localhost:4000" : `http://${LOCAL_IP}:4000`;


// Usuários
export async function getUserById(id: string): Promise<any | null> {
  try {
    const response = await get(ref(database,`profiles/${id}`));
    if (response.exists()) {
      return response.val();
    }
  } catch (error) {
    console.error("[API] getUserById erro:", error);
  }
  return null;
}

export async function getUsers(): Promise<any> {
  try {
    return await fetch(`${BASE_URL}/usuarios`);
  } catch (error) {
    console.error("[API] getUsers erro:", error);
    throw error;
  }
}

export async function createUser(data: any): Promise<Response> {
  try {
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

// Contas
export async function getAccountUserById(id: string): Promise<any | null> {
  try {
    const response = await fetch(`${BASE_URL}/contas?id=${id}`);
    if (response.ok) {
      const accounts = await response.json();
      return accounts[0] || null;
    }
  } catch (error) {
    console.error("[API] getAccountUserById erro:", error);
  }
  return null;
}

export async function updateAccountById(id: string, account: any): Promise<boolean> {
  try {
    await update(ref(database,`profiles/${id}`), {
      conta: {
        saldo: account.conta.saldo,
        extrato: account.conta.extrato,
      }
    });
    return true;
  } catch (error) {
    console.error("[API] updateAccountById erro:", error);
    return false;
  }
}

export async function createProfile(profile: any): Promise<boolean> {
  try {
    await set(ref(database,`profiles/${profile.id}`), {
      nome: profile.userName,
      dataCriacao: profile.dataCriacao.toString(),
      conta: profile.conta,
    });
    return true;
  } catch (error) {
    console.error("[API] createAccount erro:", error);
    return false;
  }
}
