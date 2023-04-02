import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const client: AppRouteModule = {
    path: '/bridge',
    name: 'Bridge',
    component: LAYOUT,
    redirect: '/bridge/form/basic',
    meta: {
        orderNo: 20,
        icon: 'iconoir:3d-bridge',
        title: t('routes.bridge.title'),
    },
    children: [
        {
            path: 'list',
            name: 'BridgeList',
            component: () => import('/@/views/bridge/list/index.vue'),
            meta: {
              title: t('routes.bridge.list.title'),
            },
          },
          {
            path: 'import',
            name: 'NewBridge',
            component: () => import('/@/views/bridge/create/index.vue'),
            meta: {
              title: t('routes.bridge.create.title'),
            },
          },
    ]
};

export default client;