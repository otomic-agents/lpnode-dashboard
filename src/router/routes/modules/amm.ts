import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const client: AppRouteModule = {
    path: '/amm',
    name: 'AMM',
    component: LAYOUT,
    redirect: '/amm/form/basic',
    meta: {
        orderNo: 13,
        icon: 'ri:mini-program-line',
        title: t('routes.amm.title'),
    },
    children: [
        {
            path: 'status',
            name: 'AmmStatus',
            component: () => import('/@/views/amm/status/index.vue'),
            meta: {
              title: t('routes.amm.list.title'),
            },
          },
          {
            path: 'install',
            name: 'AmmInstall',
            component: () => import('/@/views/amm/install/index.vue'),
            meta: {
              title: t('routes.amm.install.title'),
            },
          },
    ]
};

export default client;