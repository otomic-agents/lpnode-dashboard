import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const hedgeAccount: AppRouteModule = {
    path: '/hedge',
    name: 'Hedge',
    component: LAYOUT,
    redirect: '/hedge-account/list',
    meta: {
        orderNo: 20,
        icon: 'material-symbols:account-balance-wallet',
        title: t('routes.hedge.title'),
    },
    children: [
        {
            path: 'list',
            name: 'HedgeAccountList',
            component: () => import('/@/views/hedge-account/list/index.vue'),
            meta: {
              title: t('routes.hedge.account_list.title'),
            },
        },
        {
            path: 'create',
            name: 'HedgeAccountCreate',
            component: () => import('/@/views/hedge-account/create/index.vue'),
            meta: {
              title: t('routes.hedge.account_create.title'),
            },
        },
        {
            path: 'tasks',
            name: 'HedgeTasks',
            component: () => import('/@/views/hedge-account/tasks/index.vue'),
            meta: {
              title: t('routes.hedge.tasks.title'),
            },
        },
        {
            path: 'tasks_create',
            name: 'HedgeTaskCreate',
            component: () => import('/@/views/hedge-account/tasks/create/CreateHedgeTask.vue'),
            meta: {
              title: t('routes.hedge.tasks_create.title'),
            },
        }
    ]
};

export default hedgeAccount;