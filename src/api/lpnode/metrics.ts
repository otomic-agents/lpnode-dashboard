// src/api/lpnode/metrics.ts
import { metricsHttp } from '/@/utils/http/axios';

enum Api {
  GET_METRICS_NAMES = '/rules/metrics/names',
}
export const getAllMetrics = () =>
  metricsHttp.get<{
    code: number;
    result: {
      count: number;
      metrics: {
        name: string;
        type: string;
        availableLabels: Record<string, string[]>;
      }[];
    };
    message: string;
  }>({ url: Api.GET_METRICS_NAMES });