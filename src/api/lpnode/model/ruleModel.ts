// src/api/rules/model/ruleModel.ts

/**
 * Rule data model
 */
export interface Rule {
  _id: string;
  name: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  expression: string;
  condition: '>' | '<' | '>=' | '<=' | '==' | '!=';
  threshold: number;
  suppressionMinutes: number;
}

/**
 * Parameters for creating a rule
 */
export interface CreateRuleParams {
  name: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  expression: string;
  condition: '>' | '<' | '>=' | '<=' | '==' | '!=';
  threshold: number;
  suppressionMinutes: number;
}

/**
 * Result of creating a rule
 */
export interface CreateRuleResult {
  id: string;
  message: string;
}

/**
 * Parameters for deleting a rule
 */
export interface DeleteRuleParams {
  id: string;
}

/**
 * Result of deleting a rule
 */
export interface DeleteRuleResult {
  message: string;
}
