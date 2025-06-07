// src/services/casos.ts

export interface Caso {
  _id: string;
  titulo: string;
  contexto: {
    tipoCaso: string;
  };
  status: 'Em andamento' | 'Finalizado' | 'Arquivado' | string;
  responsavel: string; // _id do usuário
  createdAt: string;   // ISO date
  // (adicione mais campos se existir)
}

export async function getCasos(): Promise<Caso[]> {
  const res = await fetch('https://backend-dentefier.onrender.com/api/casos', {
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error('Erro ao buscar casos');
  }
  const data: Caso[] = await res.json();
  return data;
}
