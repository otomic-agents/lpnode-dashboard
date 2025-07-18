// src/api/lpnode/panel.ts

import { metricsHttp } from '/@/utils/http/axios';
import { PanelData,PanelResponse} from './model/panelModel';

enum Api {
    GET_PANELS = '/rule-results/tree',
}

/**
 * Get all panels data
 */
export const getPanels = () =>
    metricsHttp.get<PanelResponse>({
      url: Api.GET_PANELS,
    });