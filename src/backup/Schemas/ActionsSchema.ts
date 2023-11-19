import { z } from "zod";
import { IntActionTypesSchema } from "./InteractionsSchema";
import {
  ConditionTypesSchema,
  IfWhileActionTypesSchema,
} from "./ConditionalsSchema";
import { TabActionTypesSchema } from "./TabsSchema";
import { SheetActionTypeSchema } from "./replaceTypes/Actions";

export const CombinedActionTypesSchema = z.union([
  IntActionTypesSchema,
  TabActionTypesSchema,
  ConditionTypesSchema,
  SheetActionTypeSchema,
]);

export const ActionCategorySchema = CombinedActionTypesSchema.transform((v) => {
  const INTERACTION = IntActionTypesSchema.safeParse(v);
  if (INTERACTION.success) return "INTERACTION";

  const conditionCategorySchema = ConditionTypesSchema.transform((v) =>
    IfWhileActionTypesSchema.safeParse(v).success ? "IF-WHILE" : "BARRIER"
  );
  const CONDITION = conditionCategorySchema.safeParse(v);
  if (CONDITION.success && CONDITION.data === "IF-WHILE") return "IF-WHILE";
  else if (CONDITION.success && CONDITION.data === "BARRIER") return "BARRIER";

  const TABS = TabActionTypesSchema.safeParse(v);
  if (TABS.success) return "TABS";

  const SHEET = SheetActionTypeSchema.safeParse(v);
  if (SHEET.success) return "SHEET";
});
