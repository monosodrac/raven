// src/services/api.ts
export const API_URL = import.meta.env.VITE_API_URL;

export function api(path: string) {
  // garante que /api/... fique ok
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
