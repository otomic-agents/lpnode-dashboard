import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/analysis',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.dashboard.dashboard'),
  },
  children: [
    {
      path: 'moniter',
      name: 'Moniter',
      component: () => import('/@/views/dashboard/moniter/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.dashboard.moniter'),
      },
    },
    {
      path: 'analysis',
      name: 'Analysis',
      component: () => import('/@/views/dashboard/analysis/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.dashboard.analysis'),
      },
    },
    {
      path: 'workbench',
      name: 'Workbench',
      component: () => import('/@/views/dashboard/workbench/index.vue'),
      meta: {
        title: t('routes.dashboard.workbench'),
      },
    },
    // {
    //   path:'setting',
    //   name:'Setting',
    //   component: () => import('/@/views/dashboard/settings/index.vue'),
    //   meta:{
    //     title:t('routes.dashboard.settings'),
    //   }
    // }
  ],
};

export default dashboard;
