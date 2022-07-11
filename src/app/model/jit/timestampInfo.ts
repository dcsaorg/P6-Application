import { OperationsEvent } from "./operations-event";
import { TimestampDefinitionTO } from "./timestamp-definition";

export interface TimestampInfo {
    eventID: string;
    eventDeliveryStatus: string;
    operationsEventTO: OperationsEvent;
    timestampDefinitionTO: TimestampDefinitionTO;
}
