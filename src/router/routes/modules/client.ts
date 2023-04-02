import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const client: AppRouteModule = {
    path: '/chain-client',
    name: 'ChainClient',
    component: LAYOUT,
    redirect: '/chain-client/form/basic',
    meta: {
        orderNo: 12,
        icon: 'clarity:node-group-line',
        title: t('routes.chainclient.title'),
    },
    children: [
        {
            path: 'status',
            name: 'ChainClientStatus',
            component: () => import('/@/views/client/status/index.vue'),
            meta: {
              title: t('routes.chainclient.list.title'),
            },
          },
          {
            path: 'install',
            name: 'ChainClientInstall',
            component: () => import('/@/views/client/install/index.vue'),
            meta: {
              title: t('routes.chainclient.install.title'),
            },
          },
    ]
};

export default client;