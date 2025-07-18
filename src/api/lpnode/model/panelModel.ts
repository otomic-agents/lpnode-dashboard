export interface MetricValue {
    status: 'normal' | 'alert' | 'warning' | 'error';
    value: number | string;
    updatedAt: string;
    additionalData?: {
      conditionMet?: boolean;
      threshold?: number;
      condition?: string;
      [key: string]: any;
    };
  }
  
  export interface PanelMetrics {
    [metricKey: string]: MetricValue | PanelMetrics;
  }
  
  export interface PanelData {
    [panelId: string]: PanelMetrics;
  }
  
  export interface PanelResponse {
    code: number;
    result: PanelData;
    message: string;
  }