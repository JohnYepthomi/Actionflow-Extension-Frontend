import { z } from "zod";

const ActionSchema = z.object({
  id: z.string(),
  recorded: z.boolean(),
  nestingLevel: z.number().int(),
});

/* INT ACTION TYPES */
export const IntActionTypesSchema = z.union([
  z.literal("Click"),
  z.literal("Type"),
  z.literal("Keypress"),
  z.literal("Hover"),
  z.literal("Select"),
  z.literal("Code"),
  z.literal("Date"),
  z.literal("Upload"),
  z.literal("Scroll"),
  z.literal("List"),
  z.literal("Text"),
  z.literal("Attribute"),
  z.literal("Anchor"),
  z.literal("URL"),
  z.literal("Prompts"),
]);

/* :::::::::::::::::::::::::: PROPS SCHEMAS :::::::::::::::::::::::::::::::::::::: */
export const SharedInteractionsPropsSchema = z.object({
  nodeName: z.string(),
  selector: z.string(),
});
const ClickPropsSchema = z.object({
  "Wait For New Page To Load": z.boolean(),
  "Wait For File Download": z.boolean(),
  Description: z.string(),
});
const TypePropsSchema = z.object({
  Text: z.string(),
  "Overwrite Existing Text": z.boolean(),
});
const KeypressPropsSchema = z.object({
  Key: z.string(),
  "Wait For Page To Load": z.boolean(),
});
const SelectPropsSchema = z.object({
  Selected: z.string(),
  Options: z.string().array(),
  Description: z.string(),
});
const HoverPropsSchema = z.object({
  Description: z.string(),
});
const CodePropsSchema = z.object({
  Code: z.string(),
});
const PromptsPropsSchema = z.object({
  "Response Type": z.object({ Accept: z.boolean(), Decline: z.boolean() }),
  "Response Text": z.string(),
});
const DatePropsSchema = z.object({
  Date: z.string(),
});
const UploadPropsSchema = z.object({
  Path: z.string(),
});
const ScrollPropsSchema = z.object({
  Direction: z.union([z.literal("Top"), z.literal("Bottom")]).array(),
  Description: z.string(),
});
const ListPropsSchema = z.object({ variable: z.string() });
const TextPropsSchema = z.object({ variable: z.string(), value: z.string() });
const AttributePropsSchema = z.object({
  variable: z.string(),
  attribute: z.string(),
  value: z.string(),
});
const AnchorPropsSchema = z.object({ variable: z.string(), value: z.string() });
const URLPropsSchema = z.object({ variable: z.string(), value: z.string() });

/* :::::::::::::::::::::::::: INTERACTION ACTION SCHEMAS :::::::::::::::::::::::::: */
export const ClickActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Click"),
      props: z.intersection(SharedInteractionsPropsSchema, ClickPropsSchema),
    })
    .required()
);
export const TypeActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Type"),
      props: z.intersection(SharedInteractionsPropsSchema, TypePropsSchema),
    })
    .required()
);
export const KeypressActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Keypress"),
      props: z.intersection(SharedInteractionsPropsSchema, KeypressPropsSchema),
    })
    .required()
);
export const HoverActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Hover"),
      props: z.intersection(SharedInteractionsPropsSchema, HoverPropsSchema),
    })
    .required()
);
export const CodeActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Code"),
      props: CodePropsSchema,
    })
    .required()
);
export const PromptsActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Prompts"),
      props: z.intersection(SharedInteractionsPropsSchema, PromptsPropsSchema),
    })
    .required()
);
export const DateActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Date"),
      props: z.intersection(SharedInteractionsPropsSchema, DatePropsSchema),
    })
    .required()
);
export const UploadActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Upload"),
      props: z.intersection(SharedInteractionsPropsSchema, UploadPropsSchema),
    })
    .required()
);
export const ScrollActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Scroll"),
      props: z.intersection(SharedInteractionsPropsSchema, ScrollPropsSchema),
    })
    .required()
);
export const ListActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("List"),
      props: z.intersection(SharedInteractionsPropsSchema, ListPropsSchema),
    })
    .required()
);
export const TextActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Text"),
      props: z.intersection(SharedInteractionsPropsSchema, TextPropsSchema),
    })
    .required()
);
export const AttributeActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Attribute"),
      props: z.intersection(
        SharedInteractionsPropsSchema,
        AttributePropsSchema
      ),
    })
    .required()
);
export const AnchorActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Anchor"),
      props: z.intersection(SharedInteractionsPropsSchema, AnchorPropsSchema),
    })
    .required()
);
export const URLActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("URL"),
      props: URLPropsSchema,
    })
    .required()
);
export const SelectActionSchema = ActionSchema.merge(
  z
    .object({
      actionType: z.literal("Select"),
      props: z.intersection(SharedInteractionsPropsSchema, SelectPropsSchema),
    })
    .required()
);

/* :::::::::::::::::::::::::: COMBINED INTERACTION ACTION SCHEMA ::::::::::::::::: */
export const IntActionSchema = z.union([
  ClickActionSchema,
  TypeActionSchema,
  KeypressActionSchema,
  HoverActionSchema,
  CodeActionSchema,
  PromptsActionSchema,
  DateActionSchema,
  UploadActionSchema,
  ScrollActionSchema,
  ListActionSchema,
  TextActionSchema,
  AttributeActionSchema,
  AnchorActionSchema,
  URLActionSchema,
  SelectActionSchema,
]);
