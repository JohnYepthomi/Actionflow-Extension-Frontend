export type ActionEventTypes =
  | "Common"
  | "Click"
  | "Scroll"
  | "Keypress"
  | "Type"
  | "Hover"
  | "Select"
  | "Date"
  | "Upload"
  | "Code"
  | "Prompts";
export type ActionTypes = "Interaction" | "Conditions";
export type CommonProp = {
  nodeName: string;
  selector: string;
};
export type ClickProp = {
  "Wait For New Page To load": boolean;
  "Wait For File Download": boolean;
  Description: string;
};
export type ActionClickProp = CommonProp & ClickProp;
export type AllActionProps = ActionClickProp;
export type TAction = {
  id: string;
  event: ActionEventTypes;
  actionType: ActionTypes;
  props: AllActionProps;
};

export type TUpdateCondition = {
  type: "UPDATE_CONDITION";
  actionId: string;
  index: number;
  selection?: { value: string; conditionType: string; requiresCheck: boolean };
  checkValue?: string;
};
