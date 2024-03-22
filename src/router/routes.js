const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/MyDay.vue') },
      {
        path: '/event-calendar',
        component: () => import('pages/EventCalendar.vue'),
      },
      { path: '/next_actions', component: () => import('pages/NextActions.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
