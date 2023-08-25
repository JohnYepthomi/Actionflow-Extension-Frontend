// /*------------------------------------------------ Top Level Types --------------------------------------------------------------*/

// export type TAction = IntAction | ConditionalAction | TabAction | CondEndAction;

// /*------------------------------------------------ Common Types ----------------------------------------------------------------*/

// export type SvgInHtml = HTMLElement & SVGElement;

// /*------------------------------------------------ Interaction Action Props -----------------------------------------------------*/

// export type TCommonProp = {
//   nodeName: string;
//   selector: string;
// };
// export type TClickProp = TCommonProp & {
//   "Wait For New Page To load": boolean;
//   "Wait For File Download": boolean;
//   Description: string;
// };
// export type TSelectProp = TCommonProp & {
//   Selected: string;
//   Options: string[];
//   Description: string;
// };
// export type TTypeProp = TCommonProp & {
//   Text: string;
//   "Overwrite Existing Text": boolean;
// };
// export type TKeypressProp = TCommonProp & {
//   Key: string;
//   "Wait For Page To Load": boolean;
// };
// export type THoverProp = TCommonProp & {
//   Description: string;
// };
// export type TCodeProp = TCommonProp & {
//   Code: string;
// };
// export type TPromptsProp = TCommonProp & {
//   "Response Type": { Accept: boolean; Decline: boolean };
//   "Response Text": string;
// };
// export type TDateProp = TCommonProp & {
//   Date: string;
// };
// export type TUploadProp = TCommonProp & {
//   Path: string;
// };
// export type TScrollProp = TCommonProp & {
//   Direction: "Top" | "Bottom";
//   Description: string;
// };
// export type IntAction =
//   | TClickAction
//   | TTypeAction
//   | TSelectAction
//   | TKeypressAction
//   | THoverAction
//   | TCodeAction
//   | TPromptsAction
//   | TDateAction
//   | TUploadAction
//   | TScrollAction;

// export type TRecordableActions =
//   | "Click"
//   | "Scroll"
//   | "Keypress"
//   | "Type"
//   | "Hover"
//   | "Select"
//   | "SelectTab"
//   | "SelectWindow"
//   | "Navigate"
//   | "NewTab"
//   | "NewWindow"
//   | "CloseWindow"
//   | "CloseTab"
//   | "Back"
//   | "Forward";

// export type IntActionTypes =
//   | "Click"
//   | "Scroll"
//   | "Keypress"
//   | "Type"
//   | "Hover"
//   | "Select"
//   | "Date"
//   | "Upload"
//   | "Code"
//   | "Prompts";
// /*------------------------------------------------ Interaction Actions  ------------------------------------------------------------*/
// export type TClickAction = {
//   id: string;
//   actionType: "Click";
//   svg: SvgInHtml;
//   recorded: boolean;
//   props: TClickProp;
//   nestingLevel: number;
// };

// export type TTypeAction = {
//   id: string;
//   actionType: "Type";
//   svg: SvgInHtml;
//   recorded: boolean;
//   props: TTypeProp;
//   nestingLevel: number;
// };

// export type TSelectAction = {
//   id: string;
//   actionType: "Select";
//   svg: SvgInHtml;
//   recorded: boolean;
//   props: TSelectProp;
//   nestingLevel: number;
// };

// export type TKeypressAction = {
//   id: string;
//   actionType: "Keypress";
//   svg: SvgInHtml;
//   recorded: boolean;
//   props: TKeypressProp;
//   nestingLevel: number;
// };

// export type THoverAction = {
//   id: string;
//   actionType: "Hover";
//   svg: SvgInHtml;
//   recorded: boolean;
//   props: THoverProp;
//   nestingLevel: number;
// };

// export type TCodeAction = {
//   id: string;
//   actionType: "Code";
//   svg: SvgInHtml;
//   recorded: boolean;
//   props: TCodeProp;
//   nestingLevel: number;
// };

// export type TPromptsAction = {
//   id: string;
//   actionType: "Prompts";
//   svg: SvgInHtml;
//   recorded: boolean;
//   props: TPromptsProp;
//   nestingLevel: number;
// };

// export type TDateAction = {
//   id: string;
//   actionType: "Date";
//   svg: SvgInHtml;
//   recorded: boolean;
//   props: TDateProp;
//   nestingLevel: number;
// };

// export type TUploadAction = {
//   id: string;
//   actionType: "Upload";
//   svg: SvgInHtml;
//   recorded: boolean;
//   props: TUploadProp;
//   nestingLevel: number;
// };

// export type TScrollAction = {
//   id: string;
//   actionType: "Scroll";
//   svg: SvgInHtml;
//   recorded: boolean;
//   props: TScrollProp;
//   nestingLevel: number;
// };

// /*------------------------------------------------ Tab Action Type ------------------------------------------------------------*/

// export type TabActionTypes =
//   | "SelectTab"
//   | "SelectWindow"
//   | "Navigate"
//   | "NewTab"
//   | "NewWindow"
//   | "CloseWindow"
//   | "CloseTab"
//   | "Back"
//   | "Forward";
// export type TabAction = {
//   id: string;
//   actionType: TabActionTypes;
//   url?: string;
//   tabId?: string;
//   windowId?: string;
//   nestingLevel: number;
// };

// /*------------------------------------------------ Conditional Action Type ----------------------------------------------------*/

// export type CondEndEventTypes = "END" | "BREAK";
// export type CondEndAction = {
//   id: string;
//   actionType: CondEndEventTypes;
//   svg: SvgInHtml;
//   nestingLevel: number;
// };

// export type CondEventTypes = "IF" | "ELSE" | "WHILE";
// export type ConditionalAction = {
//   id: string;
//   actionType: CondEventTypes;
//   svg: SvgInHtml;
//   nestingLevel: number;
//   conditions: SelectableConditions[];
// };

// export type SelectableConditions = GeneralCondition | OperatorCondition;
// export type conditionTypes =
//   | Basic
//   | Number
//   | Text
//   | Element
//   | Spreadsheet
//   | Code;
// export type GeneralCondition = {
//   selectedType:
//     | "Basic"
//     | "Number"
//     | "Text"
//     | "Element"
//     | "Spreadsheet"
//     | "Code";
//   selectedOption: conditionTypes;
//   requiresCheck: boolean;
//   checkValue: string;
// };
// export type OperatorCondition = {
//   type: "IF" | "WHILE";
//   selected: Operator;
// };

// /*------------------------------------------------ Selectable Conditions Types Definitions -----------------------------------*/

// export type Basic = "IsEmpty" | "IsNotEmpty";

// export type Number =
//   | "GreaterThan"
//   | "GreaterThanEqualTo"
//   | "LessThan"
//   | "LessThanEqualTo"
//   | "IsEqualTo"
//   | "IsNotEqualTo";

// export type Text =
//   | "Contains"
//   | "NotContains"
//   | "StartsWith"
//   | "EndsWith"
//   | "IsExactly";

// export type Element = "IsVisible" | "IsHidden";

// export type Spreadsheet = "RowNumberExist" | "RowNumberNotExist";

// export type Operator = "OR" | "AND";

// export type Code = { value: string };

// /*------------------------------------------------- XState Event Payloads Type Definitions ----------------------------------*/
// // export type TInteractionPayload = {
// //   name: IntActionTypes;
// //   svg: SvgInHtml;
// // };

// // export type TConditionalPayload = {
// //   name: CondEventTypes;
// //   svg: SvgInHtml;
// // };

// // export type TConditionalUpdatePayload = {
// //   type: "UPDATE_CONDITION";
// //   actionId: string;
// //   index: number;
// //   selection?: {
// //     value: string;
// //     conditionType: string;
// //     selectedOption: conditionTypes;
// //     requiresCheck: boolean;
// //   };
// // };

// export type TLocalStorageKey = "composeData";

// /*----------------------------------------------------------------------------------------------------------------------------*/
