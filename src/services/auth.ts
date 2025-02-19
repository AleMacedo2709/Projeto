import { ref } from 'vue';

export interface User {
  id: number;
  nome_usuario: string;
  email_usuario: string;
  cargo_usuario: string;
}

// Mock inicial para desenvolvimento
const currentUser = ref<User>({
  id: 1,
  nome_usuario: 'João Silva',
  email_usuario: 'joao.silva@mpsp.mp.br',
  cargo_usuario: 'Promotor de Justiça'
});

export const useAuth = () => {
  const setCurrentUser = (user: User) => {
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