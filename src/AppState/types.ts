// ----------------- Top Level Types ---------------------------

export type TAction = IntAction | CondAction | TabAction | CondEndAction;

// ----------------- Common Types ---------------------------

export type SvgInHtml = HTMLElement & SVGElement;

// ----------------- Interaction Action Type ---------------------------

export type ActionEventTypes = "Click" | "Scroll" | "Keypress" | "Type" | "Hover" | "Select" | "Date" | "Upload" | "Code" | "Prompts";
export type ActionClickProp = CommonProp & ClickProp;
export type AllActionProps = ActionClickProp;
export type CommonProp = {
  nodeName: string;
  selector: string;
};
export type ClickProp = {
  "Wait For New Page To load": boolean;
  "Wait For File Download": boolean;
  Description: string;
};
export type IntAction = {
  id: string;
  actionType: ActionEventTypes;
  svg: SvgInHtml;
  recorded: boolean;
  props: AllActionProps;
  nestingLevel: number;
};

// ----------------- Tab Action Type ---------------------------

export type TabAction = {
  id: string;
  actionType: "SelectTab" | "SelectWindow" | "Navigate" | "NewTab" | "NewWindow" | "CloseTab" | "Back" | "Forward";
  url?: string;
  tabId?: string;
  windowId?: string;
  nestingLevel: number;
}

// ---------------- Conditional Action Type ---------------

export type CondEndEventTypes = "END" | "BREAK"
export type CondEndAction = {
  id: string;
  actionType: CondEndEventTypes;
  svg: SvgInHtml;
  nestingLevel: number;
};

export type CondEventTypes = "IF" | "ELSE" | "WHILE";
export type CondAction = {
  id: string;
  actionType: CondEventTypes;
  svg: SvgInHtml;
  nestingLevel: number;
  conditions: SelectableConditions[];
};

export type SelectableConditions = GeneralCondition | OperatorCondition;
export type conditionTypes = Basic | Number | Text | Element | Spreadsheet | Code;
export type GeneralCondition = {
  selectedType: "Basic" | "Number" | "Text" | "Element" | "Spreadsheet" | "Code",
  selectedOption: conditionTypes,
  requiresCheck: boolean,
  checkValue: string,
}
export type OperatorCondition = {
  type: "IF" | "WHILE",
  selected: Operator
}

// ------------------------ Selectable Conditions Types Definitions -------------------------------

export type Basic = "IsEmpty" | "IsNotEmpty"

export type Number = 
  | "GreaterThan"
  | "GreaterThanEqualTo"
  | "LessThan"
  | "LessThanEqualTo"
  | "IsEqualTo"
  | "IsNotEqualTo"

export type Text = 
  | "Contains"
  | "NotContains"
  | "StartsWith"
  | "EndsWith"
  | "IsExactly"

export type Element = 
  | "IsVisible"
  | "IsHidden"

export type Spreadsheet = 
  | "RowNumberExist"
  | "RowNumberNotExist"

export type Operator = 
  | "Or"
  | "And"

export type Code = { value : string }

// ------------------------- XState Event Payloads Type Definitions-----------------------------

export type TInteractionPayload = {
  name: ActionEventTypes;
  svg: SvgInHtml;
};

export type TConditionalPayload = {
  name: CondEventTypes;
  svg: SvgInHtml;
};

export type TConditionalUpdatePayload = {
  type: "UPDATE_CONDITION";
  actionId: string;
  index: number;
  selection?: { value: string; conditionType: string; selectedOption: conditionTypes, requiresCheck: boolean };
};

export type TLocalStorageKey = "composeData";
