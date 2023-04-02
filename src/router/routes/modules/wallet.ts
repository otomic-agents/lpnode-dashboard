import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const client: AppRouteModule = {
    path: '/wallet',
    name: 'Wallet',
    component: LAYOUT,
    redirect: '/wallet/form/basic',
    meta: {
        orderNo: 15,
        icon: 'material-symbols:account-balance-wallet',
        title: t('routes.wallet.title'),
    },
    children: [
        {
            path: 'list',
            name: 'WalletList',
            component: () => import('/@/views/wallet/list/index.vue'),
            meta: {
              title: t('routes.wallet.list.title'),
            },
          },
          {
            path: 'import',
            name: 'WalletImport',
            component: () => import('/@/views/wallet/import/index.vue'),
            meta: {
              title: t('routes.wallet.import.title'),
            },
          },
    ]
};

export default client;