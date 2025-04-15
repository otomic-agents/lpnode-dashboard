// src/api/alerts/index.ts

import { metricsHttp } from '/@/utils/http/axios';
import { Alert } from './model/alertModel';

enum Api {
    LIST = '/alerts/list',
}

/**
 * Get all alerts list
 * @param params Optional parameters for filtering alerts
 */
export const listAlerts = (params?: {
    severity?: 'info' | 'warning' | 'error' | 'critical';
    acknowledged?: boolean;
    startTime?: Date;
    endTime?: Date;
    ruleId?: string;
}) =>
    metricsHttp.get<Alert[]>({
        url: Api.LIST,
        params,
    });
