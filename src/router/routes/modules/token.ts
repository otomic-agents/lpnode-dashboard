import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const client: AppRouteModule = {
    path: '/token',
    name: 'Token',
    component: LAYOUT,
    redirect: '/token/form/basic',
    meta: {
        orderNo: 14,
        icon: 'material-symbols:token',
        title: t('routes.token.title'),
    },
    children: [
        {
            path: 'list',
            name: 'TokenList',
            component: () => import('/@/views/token/list/index.vue'),
            meta: {
              title: t('routes.token.list.title'),
            },
          },
          {
            path: 'import',
            name: 'TokenImport',
            component: () => import('/@/views/token/import/index.vue'),
            meta: {
              title: t('routes.token.import.title'),
            },
          },
    ]
};

export default client;