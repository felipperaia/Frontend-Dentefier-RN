// src/services/evidencias.ts
export interface Evidencia {
  _id: string;
  tipo: string;
  descricao: string;
  dataColeta: string;
  responsavelColeta?: string;
  registradoPor: { _id: string; username: string };
  caso: { _id: string; numeroCaso: string; titulo: string };
  arquivo?: { filename: string };
  createdAt: string;
  updatedAt: string;
}

const BASE = 'https://backend-dentefier.onrender.com/api';

export async function getEvidencias(): Promise<Evidencia[]> {
  const res = await fetch(`${BASE}/evidencias`, { credentials: 'include' });
  if (!res.ok) throw new Error('Falha ao buscar evidências');
  // alguns backends retornam { data: [...] }
  const body = await res.json();
  return Array.isArray(body) ? body : body.data;
}

export async function createEvidencia(formData: FormData): Promise<void> {
  const res = await fetch(`${BASE}/evidencias`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Falha ao criar evidência');
  }
}

export async function updateEvidencia(id: string, formData: FormData): Promise<void> {
  const res = await fetch(`${BASE}/evidencias/${id}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Falha ao atualizar evidência');
  }
}

export async function deleteEvidencia(id: string): Promise<void> {
  const res = await fetch(`${BASE}/evidencias/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Falha ao excluir evidência');
}
