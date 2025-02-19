import { createRouter, createWebHistory } from 'vue-router';
import IniciativasMPSP from '../views/IniciativasMPSP.vue';
import MinhasIniciativas from '../views/MinhasIniciativas.vue';
import GestaoIniciativas from '../views/GestaoIniciativas.vue';
import IniciativaDetalhes from '../views/IniciativaDetalhes.vue';
import NovaIniciativa from '../views/NovaIniciativa.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'iniciativas-mpsp',
      component: IniciativasMPSP
    },
    {
      path: '/iniciativa/:id',
      name: 'iniciativa-detalhes',
      component: IniciativaDetalhes
    },
    {
      path: '/minhas-iniciativas',
      name: 'minhas-iniciativas',
      component: MinhasIniciativas
    },
    {
      path: '/gestao-iniciativas',
      name: 'gestao-iniciativas',
      component: GestaoIniciativas
    },
    {
      path: '/gestao-cadastros',
      name: 'gestao-cadastros',
      component: () => import('../views/GestaoCadastros.vue'),
      meta: {
        requiresAuth: true,
        title: 'Gestão de Cadastros'
      }
    },
    {
      path: '/nova-iniciativa',
      name: 'nova-iniciativa',
      component: NovaIniciativa,
      meta: {
        requiresAuth: true,
        title: 'Nova Iniciativa'
      }
    },
    {
      path: '/iniciativa/:id/editar',
      name: 'editar-iniciativa',
      component: NovaIniciativa,
      meta: {
        requiresAuth: true,
        title: 'Editar Iniciativa'
      }
    }
  ]
});

export default router;