// src/services/users.ts

export interface User {
  _id: string;
  username: string;
  role: string;
  // (adicione outros campos caso necessário)
}

export async function getUserById(id: string): Promise<User> {
  const res = await fetch(`https://backend-dentefier.onrender.com/api/users/${id}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Usuário não encontrado');
  }
  const data: User = await res.json();
  return data;
}
