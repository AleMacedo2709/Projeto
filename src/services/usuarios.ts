import type { Usuario } from '../types/iniciativas';
import api from './api';
import { mockUsuarios } from '../mocks/usuarios';
import { mockDelay } from '../utils/mockUtils';

export const useUsuarios = () => {
  const getUsuarios = async (): Promise<Usuario[]> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockUsuarios;
      }
      const response = await api.get('/usuarios');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  };

  const getUsuario = async (id: number): Promise<Usuario | null> => {
    try {
      if (import.meta.env.DEV) {
        await mockDelay();
        return mockUsuarios.find(u => u.id === id) || null;
      }
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return null;
    }
  };

  return {
    getUsuarios,
    getUsuario
  };
}; 