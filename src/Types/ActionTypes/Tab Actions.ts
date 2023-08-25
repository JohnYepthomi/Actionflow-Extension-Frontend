export type TabActionTypes =
  | "SelectTab"
  | "SelectWindow"
  | "Navigate"
  | "NewTab"
  | "NewWindow"
  | "CloseWindow"
  | "CloseTab"
  | "Back"
  | "Forward";
export type TabAction = {
  id: string;
  actionType: TabActionTypes;
  url?: string;
  tabId?: string;
  windowId?: string;
  nestingLevel: number;
};
