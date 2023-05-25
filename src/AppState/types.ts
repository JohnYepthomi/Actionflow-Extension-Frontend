export type ActionEventTypes =
  | "Click"
  | "Scroll"
  | "Keypress"
  | "Type"
  | "Hover"
  | "Select"
  | "Date"
  | "Upload"
  | "Code"
  | "Prompts"
  | "IF"
  | "WHILE"
  | "END"
  | "ELSE"
  | "BREAK"
  | "SelectTab"
  | "NewTab"
  | "CloseTab"
  | "Visit"

export type CommonProp = {
  nodeName: string;
  selector: string;
};
export type ClickProp = {
  "Wait For New Page To load": boolean;
  "Wait For File Download": boolean;
  Description: string;
};
export type SelectTabProp = {
  url: string;
  id: string;
};
export type ActionClickProp = CommonProp & ClickProp;
export type ActionSelectTabProp = SelectTabProp;
export type AllActionProps = ActionClickProp | ActionSelectTabProp;
export type TAction = {
  id: string;
  // event: ActionEventTypes;
  actionType: ActionEventTypes;
  svg: SvgInHtml;
  recorded?: boolean;
  props?: AllActionProps;
  nestingLevel: number;
  conditions?: TCondition[];
};

export type SvgInHtml = HTMLElement & SVGElement;

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

export type TLocalStorageKey = "composeData";
