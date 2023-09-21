import { z } from "zod";

const ActionSchema = z.object({
  id: z.string(),
  recorded: z.boolean(),
  nestingLevel: z.number().int(),
});

export const TabActionTypesSchema = z.union([
  z.literal("SelectTab"),
  z.literal("SelectWindow"),
  z.literal("Navigate"),
  z.literal("NewTab"),
  z.literal("NewWindow"),
  z.literal("CloseWindow"),
  z.literal("CloseTab"),
  z.literal("Back"),
  z.literal("Forward"),
]);

/* :::::::::::::::::::::::::: PROPS SCHEMA ::::::::::::::::::::::::::::::::: */
export const TabPropsSchema = z.object({
  url: z.string().optional(),
  tabId: z.number().optional(),
  windowId: z.number().optional(),
});

/* :::::::::::::::::::::::::: TAB ACTIONS SCHEMAS :::::::::::::::::::::::::: */
export const TabSelectActionSchema = ActionSchema.merge(
  z.object({
    actionType: z.literal("SelectTab"),
    props: TabPropsSchema,
  })
);
export const TabSelectWindowActionSchema = ActionSchema.merge(
  z.object({
    actionType: z.literal("SelectWindow"),
    props: TabPropsSchema,
  })
);
export const TabNavigateActionSchema = ActionSchema.merge(
  z.object({
    actionType: z.literal("Navigate"),
    props: TabPropsSchema,
  })
);
export const TabNewTabActionSchema = ActionSchema.merge(
  z.object({
    actionType: z.literal("NewTab"),
    props: TabPropsSchema,
  })
);
export const TabNewWindowActionSchema = ActionSchema.merge(
  z.object({
    actionType: z.literal("NewWindow"),
    props: TabPropsSchema,
  })
);
export const TabCloseWindowActionSchema = ActionSchema.merge(
  z.object({
    actionType: z.literal("CloseWindow"),
    props: TabPropsSchema,
  })
);
export const TabCloseTabActionSchema = ActionSchema.merge(
  z.object({
    actionType: z.literal("CloseTab"),
    props: TabPropsSchema,
  })
);
export const TabBackActionSchema = ActionSchema.merge(
  z.object({
    actionType: z.literal("Back"),
    props: TabPropsSchema,
  })
);
export const TabForwardActionSchema = ActionSchema.merge(
  z.object({
    actionType: z.literal("Forward"),
    props: TabPropsSchema,
  })
);

/* :::::::::::::::::::::::::: COMBINED TAB ACTION SCHEMA ::::::::::::::::::: */
export const TabsActionSchema = z.union([
  TabNewTabActionSchema,
  TabSelectActionSchema,
  TabSelectWindowActionSchema,
  TabNavigateActionSchema,
  TabNewWindowActionSchema,
  TabCloseWindowActionSchema,
  TabCloseTabActionSchema,
  TabBackActionSchema,
  TabForwardActionSchema,
]);
