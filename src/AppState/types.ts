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
export type TActionTypes = "INTERACTION" | "CONDITIONALS";
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
  actionType: TActionTypes;
  svg: SvgInHtml;
  recorded?: boolean;
  props?: AllActionProps;
  conditions?: TCondition[];
};

type SvgInHtml = HTMLElement & SVGElement;

export type TUpdateConditionEventPayload = {
  type: "UPDATE_CONDITION";
  actionId: string;
  index: number;
  selection?: { value: string; conditionType: string; requiresCheck: boolean };
  checkValue?: string;
};

export type TCondition = {
  selectedType: string;
  selectedOption: string;
  requiresCheck: boolean;
  checkValue: null | string;
};

export type TInteractionItemPayload = {
  name: ActionEventTypes;
  svg: SvgInHtml;
};

export type TLocalStorageKey = "ComposeData";
