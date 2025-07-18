// src/api/rules/index.ts

import { lpHttp, metricsHttp } from '/@/utils/http/axios';
import {
    Rule,
    CreateRuleParams,
    CreateRuleResult,
    DeleteRuleParams,
    DeleteRuleResult
} from './model/ruleModel';

enum Api {
    CREATE = '/rules/create',
    LIST = '/rules/list',
    DELETE = '/rules/delete',
}

/**
 * Create a new rule
 * @param data Rule creation parameters
 */
export const createRule = (data: CreateRuleParams) =>
    metricsHttp.post<CreateRuleResult>({ url: Api.CREATE, data });

/**
 * Get all rules list
 */
export const listRules = () =>
    metricsHttp.get<Rule[]>({ url: Api.LIST });

/**
 * Delete a specific rule
 * @param id Rule ID
 */
export const deleteRule = (id: string) =>
    metricsHttp.delete<DeleteRuleResult>({ url: `${Api.DELETE}/${id}` });
