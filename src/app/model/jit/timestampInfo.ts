import { OperationsEvent } from "./operations-event";
import { timestampDefinitionTO } from "./timestamp-definition";

export interface TimestampInfo {
    eventID: string;
    eventDeliveryStatus: string;
    operationsEventTO: OperationsEvent;
    timestampDefinitionTO: timestampDefinitionTO;
}
