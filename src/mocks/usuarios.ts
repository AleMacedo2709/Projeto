import type { Usuario } from '../types/iniciativas';

export const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nome_usuario: 'João Silva',
    email_usuario: 'joao.silva@mpsp.mp.br',
    cargo_usuario: 'Promotor de Justiça',
    nivel_acesso: 'gestor_cadastros',
    data_criacao: '2024-01-01T00:00:00',
    data_atualizacao: '2024-01-01T00:00:00'
  },
  {
    id: 2,
    nome_usuario: 'Maria Santos',
    email_usuario: 'maria.santos@mpsp.mp.br',
    cargo_usuario: 'Gerente de Projetos',
    data_criacao: '2024-01-01T00:00:00',
    data_atualizacao: '2024-01-01T00:00:00'
  },
  {
    id: 3,
    nome_usuario: 'Pedro Costa',
    email_usuario: 'pedro.costa@mpsp.mp.br',
    cargo_usuario: 'Coordenador',
    data_criacao: '2024-01-01T00:00:00',
    data_atualizacao: '2024-01-01T00:00:00'
  }
]; 