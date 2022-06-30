import { OperationsEvent } from "./operations-event";
import { TimestampDefinition } from "./timestamp-definition";

export interface TimestampInfo {
    eventID: string;
    eventDeliveryStatus: string;
    operationsEventTO: OperationsEvent;
    timestampDefinitionTO: TimestampDefinition;
}
