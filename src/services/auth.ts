import { ref } from 'vue';
import type { Usuario } from '../types/iniciativas';
import { mockUsuarios } from '../mocks/usuarios';

// Mock inicial para desenvolvimento
const currentUser = ref<Usuario>(mockUsuarios[0]);

export const useAuth = () => {
  const setCurrentUser = (user: Usuario) => {
    currentUser.value = user;
  };

  const getCurrentUser = () => currentUser.value;

  const isAuthenticated = () => !!currentUser.value;

  const clearCurrentUser = () => {
    currentUser.value = null as any; // Permitido apenas em desenvolvimento
  };

  return {
    currentUser,
    setCurrentUser,
    getCurrentUser,
    isAuthenticated,
    clearCurrentUser
  };
}; 