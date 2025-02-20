import { createRouter, createWebHistory } from 'vue-router';
import IniciativasMPSP from '../views/IniciativasMPSP.vue';
import MinhasIniciativas from '../views/MinhasIniciativas.vue';
import IniciativaDetalhes from '../views/IniciativaDetalhes.vue';
import NovaIniciativa from '../views/NovaIniciativa.vue';
import EditarIniciativa from '../views/EditarIniciativa.vue';
import { useAuth } from '../services/auth';

const routes = [
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
    component: () => import('../views/GestaoIniciativas.vue'),
    meta: {
      requiresAuth: true,
      title: 'Gestão de Iniciativas',
      allowedRoles: ['gestor_selo_pgj', 'gestor_selo_cg']
    }
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
    component: EditarIniciativa,
    meta: {
      requiresAuth: true,
      title: 'Editar Iniciativa'
    }
  },
  {
    path: '/metricas',
    name: 'metricas',
    component: () => import('../views/MetricasView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Métricas e KPIs'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const auth = useAuth();
  const user = auth.getCurrentUser();
  
  if (to.meta.requiresAuth && !user) {
    next('/login');
    return;
  }

  if (to.meta.requiresGestorSelo && 
      user?.nivel_acesso !== 'gestor_selo_pgj' && 
      user?.nivel_acesso !== 'gestor_selo_cg') {
    next('/');
    return;
  }

  next();
});

export default router;