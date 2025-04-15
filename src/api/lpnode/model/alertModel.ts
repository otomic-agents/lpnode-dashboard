export interface Alert {
    _id: string;
    ruleId: string;
    ruleName: string;
    description: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    value: number | string | any;  // The actual value that triggered the alert
    threshold: number;
    condition: '>' | '<' | '>=' | '<=' | '==' | '!=';
    triggered: boolean;  // Whether the alert is active
    acknowledged: boolean;  // Whether the alert has been acknowledged
    acknowledgedBy?: string;  // ID of the user who acknowledged the alert
    acknowledgedAt?: Date;  // Time when the alert was acknowledged
    isErrorAlert: boolean;  // Whether it's an error alert (vs threshold alert)
    notified: boolean;  // Whether notification has been sent
    lastNotifiedAt?: Date;  // Time of the last notification
    createdAt: Date;  // Alert creation time
    updatedAt: Date;  // Alert update time
    resolvedAt?: Date;  // Time when the alert was resolved
  }
  