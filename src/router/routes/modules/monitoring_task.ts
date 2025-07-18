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
      name: 'Monitoring_Task_List',
      component: () => import('/@/views/monitoring_task/list/index.vue'),
      meta: {
        title: t('routes.monitoring_task.list.title'),
      },
    },
    {
      path: 'create',
      name: 'Monitoring_Task_Create',
      component: () => import('/@/views/monitoring_task/create/index.vue'),
      meta: {
        title: t('routes.monitoring_task.create.title'),
      },
    },

    {
      path: 'panel',
      name: 'Monitoring_Panel',
      component: () => import('/@/views/monitoring_task/panel/index.vue'),
      meta: {
        title: t('routes.monitoring_task.alert_rule.panel.title'),
      },
    },
    {
      path: 'alert-history',
      name: 'Alert_History',
      component: () => import('/@/views/monitoring_task/alert_history/index.vue'),
      meta: {
        title: t('routes.monitoring_task.alert_history.title'),
      },
    },
    {
      path: 'alert-rule/list',
      name: 'Alert_Rule_List',
      component: () => import('/@/views/monitoring_task/alert_rule/list/index.vue'),
      meta: {
        title: t('routes.monitoring_task.alert_rule.list.title')
      },
    },
    {
      path: 'alert-rule/create',
      name: 'Alert_Rule_Create',
      component: () => import('/@/views/monitoring_task/alert_rule/create/index.vue'),
      meta: {
        title: t('routes.monitoring_task.alert_rule.create.title'),
        hideMenu:true,
      },
    },


  ],
};

export default client;
