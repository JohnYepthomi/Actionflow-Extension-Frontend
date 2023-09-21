/*------------------------------------------------ Conditional Action Type ----------------------------------------------------*/
export type CondEndEventTypes = "ELSE" | "END" | "BREAK";
export type CondEndAction = {
  id: string;
  actionType: CondEndEventTypes;
  nestingLevel: number;
};

export type CondEventTypes = "IF" | "WHILE";
export type ConditionalAction = {
  id: string;
  actionType: CondEventTypes;
  nestingLevel: number;
  conditions: SelectableConditions[];
};

export type SelectableConditions = GeneralCondition | OperatorCondition;
export type conditionTypes =
  | Basic
  | Number
  | Text
  | Element
  | Spreadsheet
  | Code;
export type GeneralCondition = {
  selectedType:
    | "Basic"
    | "Number"
    | "Text"
    | "Element"
    | "Spreadsheet"
    | "Code";
  selectedOption: conditionTypes;
  requiresCheck: boolean;
  checkValue: string;
};
export type OperatorCondition = {
  // type: "IF" | "WHILE";
  selected: Operator;
};

/*------------------------------------------------ Selectable Conditions Types Definitions -----------------------------------*/

export type Basic = "IsEmpty" | "IsNotEmpty";

export type Number =
  | "GreaterThan"
  | "GreaterThanEqualTo"
  | "LessThan"
  | "LessThanEqualTo"
  | "IsEqualTo"
  | "IsNotEqualTo";

export type Text =
  | "Contains"
  | "NotContains"
  | "StartsWith"
  | "EndsWith"
  | "IsExactly";

export type Element = "IsVisible" | "IsHidden";

export type Spreadsheet = "RowNumberExist" | "RowNumberNotExist";

export type Operator = "OR" | "AND";

export type Code = { value: string };
