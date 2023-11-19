import { z } from "zod";

const ActionSchema = z.object({
  id: z.string(),
  recorded: z.boolean(),
  nestingLevel: z.number().int(),
});

/* ::::::::::::::::::: Condition Options Schema ::::::::::::::::::::::::::::: */
export const BasicOptionsSchema = z.union([
  z.literal("IsEmpty"),
  z.literal("IsNotEmpty"),
]);
export const NumberOptionsSchema = z.union([
  z.literal("GreaterThan"),
  z.literal("GreaterThanEqualTo"),
  z.literal("LessThan"),
  z.literal("LessThanEqualTo"),
  z.literal("IsEqualTo"),
  z.literal("IsNotEqualTo"),
]);
export const TextOptionsSchema = z.union([
  z.literal("Contains"),
  z.literal("NotContains"),
  z.literal("StartsWith"),
  z.literal("EndsWith"),
  z.literal("IsExactly"),
]);
export const ElementOptionsSchema = z.union([
  z.literal("IsVisible"),
  z.literal("IsHidden"),
]);
export const SpreadsheetOptionsSchema = z.union([
  z.literal("RowNumberExist"),
  z.literal("RowNumberNotExist"),
]);
export const OperatorOptionsSchema = z.union([
  z.literal("OR"),
  z.literal("AND"),
]);
export const CodeSchema = z.object({ value: z.string() });

/* ::::::::::::::::::: Conditions Schema ::::::::::::::::::::::::::::: */
export const SelectedTypeSchema = z.union([
  z.literal("Basic"),
  z.literal("Number"),
  z.literal("Text"),
  z.literal("Element"),
  z.literal("Spreadsheet"),
  z.literal("Code"),
]);

export const SelectedOptionSchema = z.union([
  BasicOptionsSchema,
  NumberOptionsSchema,
  TextOptionsSchema,
  ElementOptionsSchema,
  SpreadsheetOptionsSchema,
  CodeSchema,
]);

export const GeneralConditionSchema = z.object({
  selectedVariable: z.string(),
  selectedType: SelectedTypeSchema,
  selectedOption: SelectedOptionSchema,
  requiresCheck: z.boolean(),
  checkValue: z.string(),
});
export const OperatorConditionSchema = z.object({
  type: z.literal("Operator"),
  selected: OperatorOptionsSchema,
});

/* ::::::::::::::::::: Conditions Actions can't be recorded. :::::::::::::::: */
export const IfActionSchema = ActionSchema.omit({
  recorded: true,
}).merge(
  z.object({
    actionType: z.literal("IF"),
    conditions: z
      .union([GeneralConditionSchema, OperatorConditionSchema])
      .array(),
  })
);
export const WhileActionSchema = ActionSchema.omit({
  recorded: true,
}).merge(
  z.object({
    actionType: z.literal("WHILE"),
    conditions: z
      .union([GeneralConditionSchema, OperatorConditionSchema])
      .array(),
  })
);
export const ConditionActionSchema = z.union([
  IfActionSchema,
  WhileActionSchema,
]);

/* ::::::::::::::::::: Barrier Actions can't be recorded. ::::::::::::::::::: */
export const ElseActionSchema = ActionSchema.omit({
  recorded: true,
}).merge(
  z.object({
    actionType: z.literal("ELSE"),
  })
);
export const EndActionSchema = ActionSchema.omit({
  recorded: true,
}).merge(
  z.object({
    actionType: z.literal("END"),
  })
);
export const BreakActionSchema = ActionSchema.omit({
  recorded: true,
}).merge(
  z.object({
    actionType: z.literal("BREAK"),
  })
);
export const BarrierActionSchema = z.union([
  ElseActionSchema,
  EndActionSchema,
  BreakActionSchema,
]);

export const BarrierActionTypesSchema = z.union([
  z.literal("ELSE"),
  z.literal("END"),
  z.literal("BREAK"),
]);

export const IfWhileActionTypesSchema = z.union([
  z.literal("IF"),
  z.literal("WHILE"),
]);

export const ConditionTypesSchema = z.union([
  z.literal("IF"),
  z.literal("WHILE"),
  z.literal("ELSE"),
  z.literal("END"),
  z.literal("BREAK"),
]);


