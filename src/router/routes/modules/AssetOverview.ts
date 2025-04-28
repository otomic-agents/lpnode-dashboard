import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const assetOverview: AppRouteModule = {
    path: '/asset-overview',
    name: 'AssetOverview',
    component: LAYOUT,
    redirect: '/asset-overview/dex',
    meta: {
        orderNo: 25,
        icon: 'material-symbols:account-balance',
        title: t('routes.AssetOverview.overview'),
    },
    children: [
        {
            path: 'dex',
            name: 'DexAssets',
            component: () => import('/@/views/asset-overview/dex/index.vue'),
            meta: {
              title: t('routes.AssetOverview.dex.title'),
            },
        },
        {
            path: 'cex',
            name: 'CexAssets',
            component: () => import('/@/views/asset-overview/cex/index.vue'),
            meta: {
              title: t('routes.AssetOverview.cex.title'),
            },
        }
    ]
};

export default assetOverview;
