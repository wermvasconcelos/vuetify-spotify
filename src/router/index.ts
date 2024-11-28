import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/views/HomeView.vue'), // Substitua com seu componente principal
  },
  {
    path: '/callback',
    name: 'Callback',
    component: () => import('@/pages/views/CallbackView.vue'), // Página de callback
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
