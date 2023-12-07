import type { TAction } from "../ActionTypes/Action";

export interface TAppContext {
  flowActions: TAction[];
  activeTab: string |undefined;
}

export type TAppState<T> =
  | { value: "restoring"; context: T }
  | { value: "idle"; context: T }
  | { value: "dbOperations"; context: T }
  | { value: "recording"; context: T }
  | { value: "handleError"; context: T }
  | { value: "error"; context: T };
