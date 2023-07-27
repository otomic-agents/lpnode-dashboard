export interface ListParams {
  id?: string;
}

export interface TaskInfo {
  _id: string;
  name: string;
  corn: string;
  createdAt: number;
  scriptPath: string;
  taskType: string;
}
export interface DeleteParams {
  _id: string;
}
export interface RunParams {
  scriptContent: string;
}
export interface RunResultParams {
  scriptName: string;
}
export interface ScriptAddParams {
  name: string;
  cron: string;
  scriptBody: string;
}
export interface DeleteModel {
  code: number;
  data: number;
  message: string;
}
export interface RunModel {
  code: number;
  data: string;
  message: string;
}
export interface RunResultModel {
  code: number;
  data: string;
  message: string;
}
export interface ScriptAddResultModel {
  code: number;
  data: string;
  message: string;
}
export interface ListModel {
  code: number;
  data: TaskInfo[];
  message: string;
}
