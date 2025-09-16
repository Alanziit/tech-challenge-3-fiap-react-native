// api.ts
// Base URL para web e mobile
const isWeb = typeof document !== "undefined";
const LOCAL_IP = "193.186.4.237"; // IP da sua máquina na rede
const BASE_URL = isWeb ? "http://localhost:4000" : `http://${LOCAL_IP}:4000`;

// Usuários
export async function getUserById(id: number): Promise<any | null> {
  try {
    const response = await fetch(`${BASE_URL}/usuarios?id=${id}`);
    if (response.ok) {
      const users = await response.json();
      return users[0] || null;
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
export async function getAccountUserById(id: number): Promise<any | null> {
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

export async function updateAccountById(id: number, account: any): Promise<Response> {
  try {
    return await fetch(`${BASE_URL}/contas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
    });
  } catch (error) {
    console.error("[API] updateAccountById erro:", error);
    throw error;
  }
}

export async function createAccount(account: any): Promise<Response> {
  try {
    return await fetch(`${BASE_URL}/contas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(account),
    });
  } catch (error) {
    console.error("[API] createAccount erro:", error);
    throw error;
  }
}
