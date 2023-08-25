export type TSheetProps = any;

export type SheetAction = {
  id: string;
  actionType: "Sheet";
  props: TSheetProps;
  nestingLevel: number;
};
