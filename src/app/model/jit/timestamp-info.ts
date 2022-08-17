import { OperationsEvent } from "./operations-event";
import { TimestampDefinitionTO } from "./timestamp-definition";
import {Port} from "../portCall/port";

export interface TimestampInfo {
    eventID: string;
    eventDeliveryStatus: string;
    operationsEventTO: OperationsEvent;
    timestampDefinitionTO: TimestampDefinitionTO;

    // Values computed in the UI
    isLatestInCycle: Boolean;
    sequenceColor: string;
    port: Port;
}
