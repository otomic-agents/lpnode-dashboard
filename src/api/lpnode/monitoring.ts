import { lpHttp } from '/@/utils/http/axios';

import {
  ListParams,
  TaskInfo,
  DeleteParams,
  DeleteModel,
  RunParams,
  RunResultParams,
  RunModel,
  RunResultModel,
  ScriptAddParams,
  ScriptAddResultModel,
  RunExpressionParams, // Add this new type
  RunExpressionModel,   // Add this new type
} from './model/monitoringModel';

enum Api {
  SCRIPTADD = '/lpnode/lpnode_admin_panel/monit/script_add',
  RUNRESULT = '/lpnode/lpnode_admin_panel/monit/run_result',
  RUN = '/lpnode/lpnode_admin_panel/monit/script_run',
  LIST = '/lpnode/lpnode_admin_panel/monit/task_list',
  DELETE = '/lpnode/lpnode_admin_panel/monit/task_del',
  RUNEXPRESSION = '/lpnode/alert_systems/metrics/rules/runcode'
}

export const scriptAdd = (data: ScriptAddParams) =>
  lpHttp.post<ScriptAddResultModel>({ url: Api.SCRIPTADD, data });
export const runResult = (data: RunResultParams) =>
  lpHttp.post<RunResultModel>({ url: Api.RUNRESULT, data });
export const run = (data: RunParams) => lpHttp.post<RunModel>({ url: Api.RUN, data });
export const list = (data: ListParams) => lpHttp.get<TaskInfo[]>({ url: Api.LIST, data });
export const deleteTask = (data: DeleteParams) =>
  lpHttp.post<DeleteModel>({ url: Api.DELETE, data });
export const runExpression = (data: RunExpressionParams) =>
  lpHttp.post<RunExpressionModel>({ url: Api.RUNEXPRESSION, data });
