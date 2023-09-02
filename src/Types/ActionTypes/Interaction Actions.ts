export type IntActionTypes =
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
  | "List"
  | "Text"
  | "Attribute"
  | "Anchor"
  | "URL";

/*------------------------------------------------ Interaction Action Props -----------------------------------------------------*/

export type TCommonProp = {
  nodeName: string;
  selector: string;
};
export type TClickProp = TCommonProp & {
  "Wait For New Page To load": boolean;
  "Wait For File Download": boolean;
  Description: string;
};
export type TSelectProp = TCommonProp & {
  Selected: string;
  Options: string[];
  Description: string;
};
export type TTypeProp = TCommonProp & {
  Text: string;
  "Overwrite Existing Text": boolean;
};
export type TKeypressProp = TCommonProp & {
  Key: string;
  "Wait For Page To Load": boolean;
};
export type THoverProp = TCommonProp & {
  Description: string;
};
export type TCodeProp = TCommonProp & {
  Code: string;
};
export type TPromptsProp = TCommonProp & {
  "Response Type": { Accept: boolean; Decline: boolean };
  "Response Text": string;
};
export type TDateProp = TCommonProp & {
  Date: string;
};
export type TUploadProp = TCommonProp & {
  Path: string;
};
export type TScrollProp = TCommonProp & {
  Direction: "Top" | "Bottom";
  Description: string;
};
export type TListProp = TCommonProp & { variable: string };
export type TTextProp = TCommonProp & { variable: string; value: string };
export type TAttributeProp = TCommonProp & {
  variable: string;
  attribute: string;
  value: string;
};
export type TAnchorProp = TCommonProp & { variable: string; value: string };
export type TURLProp = { variable: string; value: string };

export type IntAction =
  | TClickAction
  | TTypeAction
  | TSelectAction
  | TKeypressAction
  | THoverAction
  | TCodeAction
  | TPromptsAction
  | TDateAction
  | TUploadAction
  | TScrollAction
  | TListAction
  | TTextAction
  | TAttributeAction
  | TAnchorAction
  | TURLAction;

/*------------------------------------------------ Interaction Actions  ------------------------------------------------------------*/

export type TClickAction = {
  id: string;
  actionType: "Click";
  recorded: boolean;
  props: TClickProp;
  nestingLevel: number;
};

export type TTypeAction = {
  id: string;
  actionType: "Type";
  recorded: boolean;
  props: TTypeProp;
  nestingLevel: number;
};

export type TSelectAction = {
  id: string;
  actionType: "Select";
  recorded: boolean;
  props: TSelectProp;
  nestingLevel: number;
};

export type TKeypressAction = {
  id: string;
  actionType: "Keypress";
  recorded: boolean;
  props: TKeypressProp;
  nestingLevel: number;
};

export type THoverAction = {
  id: string;
  actionType: "Hover";
  recorded: boolean;
  props: THoverProp;
  nestingLevel: number;
};

export type TCodeAction = {
  id: string;
  actionType: "Code";
  recorded: boolean;
  props: TCodeProp;
  nestingLevel: number;
};

export type TPromptsAction = {
  id: string;
  actionType: "Prompts";
  recorded: boolean;
  props: TPromptsProp;
  nestingLevel: number;
};

export type TDateAction = {
  id: string;
  actionType: "Date";
  recorded: boolean;
  props: TDateProp;
  nestingLevel: number;
};

export type TUploadAction = {
  id: string;
  actionType: "Upload";
  recorded: boolean;
  props: TUploadProp;
  nestingLevel: number;
};

export type TScrollAction = {
  id: string;
  actionType: "Scroll";
  recorded: boolean;
  props: TScrollProp;
  nestingLevel: number;
};
export type TListAction = {
  id: string;
  actionType: "List";
  recorded: boolean;
  props: TListProp;
  nestingLevel: number;
};
export type TTextAction = {
  id: string;
  actionType: "Text";
  recorded: boolean;
  props: TTextProp;
  nestingLevel: number;
};
export type TAttributeAction = {
  id: string;
  actionType: "Attribute";
  recorded: boolean;
  props: TAttributeProp;
  nestingLevel: number;
};
export type TAnchorAction = {
  id: string;
  actionType: "Anchor";
  recorded: boolean;
  props: TAnchorProp;
  nestingLevel: number;
};
export type TURLAction = {
  id: string;
  actionType: "URL";
  recorded: boolean;
  props: TURLProp;
  nestingLevel: number;
};
