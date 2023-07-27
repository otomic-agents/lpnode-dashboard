import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const client: AppRouteModule = {
  path: '/monitoring',
  name: 'Monitoring_Task',
  component: LAYOUT,
  redirect: '/token/form/basic',
  meta: {
    orderNo: 15,
    icon: 'ant-design:alert-filled',
    title: t('routes.monitoring_task.title'),
  },
  children: [
    {
      path: 'list',
      name: t('routes.monitoring_task.list.title'),
      component: () => import('/@/views/monitoring_task/list/index.vue'),
      meta: {
        title: t('routes.monitoring_task.list.title'),
      },
    },
    {
      path: 'create',
      name: t('routes.monitoring_task.create.title'),
      component: () => import('/@/views/monitoring_task/create/index.vue'),
      meta: {
        title: t('routes.monitoring_task.create.title'),
      },
    },
  ],
};

export default client;
