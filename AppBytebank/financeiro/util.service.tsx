export async function getUserById(id: number) : Promise<Response | null> {
  const response = await fetch(`http://localhost:4000/usuarios?id=${id}`);

  if (response.ok) {
    const user = await response.json();

    return user[0];
  }

  return null;
}

export async function getUsers(): Promise<Response> {
  return await fetch("http://localhost:4000/usuarios");
}

export async function createUser(data:any) {
  return await fetch('http://localhost:4000/usuarios',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });
}

export async function getAccountUserById(id:number): Promise<Response | null> {
  const response = await fetch(`http://localhost:4000/contas?id=${id}`);

  if (response.ok) {
    const account = await response.json();

    return account[0];
  }

  return null;
}

export async function updateAccountById(id:number,account:any) : Promise<Response> {
  return await fetch(`http://localhost:4000/contas/${id}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(account),
    });
}

export async function createAccount(account:any) : Promise<Response> {
  return await fetch('http://localhost:4000/contas',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(account),
    });
}