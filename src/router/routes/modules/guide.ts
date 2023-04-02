import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const client: AppRouteModule = {
    path: '/guide',
    name: 'Guide',
    component: LAYOUT,
    redirect: '/guide/form/basic',
    meta: {
        orderNo: 11,
        icon: 'ep:guide',
        title: t('routes.guide.title'),
    },
    children: [
        {
            path: 'guide',
            name: 'Guide',
            component: () => import('/@/views/guide/guide/index.vue'),
            meta: {
              title: t('routes.guide.guide.title'),
            },
          },
    ]
};

export default client;