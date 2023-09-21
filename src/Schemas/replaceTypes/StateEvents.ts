import { z } from "zod";
import {
  ActionDragEventSchema,
  ActionEventWithoutPayloadSchema,
  AddOperatorEventSchema,
  CreateInteractionActionEventSchema,
  CreateRecordedActionEventSchema,
  DatabaseEventSchema,
  UpdateActiveTabEventSchema,
  UpdateConditionActionEventSchema,
  UpdateInteractionActionEventSchema,
  UpdateTabActionEventSchema,
} from "../SateEventsSchema";

export type TCreateInteractonActionEvent = z.infer<
  typeof CreateInteractionActionEventSchema
>;
export type TCreateRecordedActionEvent = z.infer<
  typeof CreateRecordedActionEventSchema
>;
export type TActionDragEvent = z.infer<typeof ActionDragEventSchema>;
export type TUpdateInteractionActionEvent = z.infer<
  typeof UpdateInteractionActionEventSchema
>;
export type TUpdateConditionActionEvent = z.infer<
  typeof UpdateConditionActionEventSchema
>;
export type TUpdateActiveTabEvent = z.infer<typeof UpdateActiveTabEventSchema>;
export type TAddOperatorEvent = z.infer<typeof AddOperatorEventSchema>;
export type TActionEventWithoutPayload = z.infer<
  typeof ActionEventWithoutPayloadSchema
>;
export type TUpdateTabActionEvent = z.infer<typeof UpdateTabActionEventSchema>;
export type TDatabaseEvents = z.infer<typeof DatabaseEventSchema>;

export type TAppEvents =
  | TCreateInteractonActionEvent
  | TCreateRecordedActionEvent
  | TActionDragEvent
  | TUpdateInteractionActionEvent
  | TUpdateConditionActionEvent
  | TUpdateActiveTabEvent
  | TAddOperatorEvent
  | TActionEventWithoutPayload
  | TUpdateTabActionEvent
  | TDatabaseEvents;
