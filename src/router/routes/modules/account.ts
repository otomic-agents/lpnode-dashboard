import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const client: AppRouteModule = {
    path: '/account',
    name: 'Account',
    component: LAYOUT,
    redirect: '/account/form/basic',
    meta: {
        orderNo: 20,
        icon: 'material-symbols:account-box',
        title: t('routes.account.title'),
    },
    children: [
        {
            path: 'list',
            name: 'AccountList',
            component: () => import('/@/views/account/list/index.vue'),
            meta: {
              title: t('routes.account.list.title'),
            },
          },
          {
            path: 'register',
            name: 'AccountRegister',
            component: () => import('/@/views/account/register/index.vue'),
            meta: {
              title: t('routes.account.register.title'),
            },
          },
          {
            path: 'limiter',
            name: 'AuthenticationLimiter',
            component: () => import('/@/views/account/limiter/index.vue'),
            meta: {
              title: t('routes.account.limiter.title'),
            },
          },
    ]
};

export default client;