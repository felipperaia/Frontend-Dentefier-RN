// src/services/auth.ts

export interface User {
  _id: string;
  username: string;
  role: string;
  // (adicione mais campos se precisar)
}

export async function login(
  username: string,
  password: string
): Promise<{ success: boolean; message?: string; user?: User }> {
  try {
    const response = await fetch('https://backend-dentefier.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message || 'Erro ao logar' };
    }
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Erro ao chamar API de login:', error);
    return { success: false, message: 'Erro de rede' };
  }
}

export async function getMe(): Promise<User> {
  // Esta rota “/me” deve retornar os dados do usuário autenticado
  const response = await fetch('https://backend-dentefier.onrender.com/api/auth/me', {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Usuário não autenticado');
  }
  const userData: User = await response.json();
  return userData;
}
