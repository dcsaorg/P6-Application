import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestamp} from "../../model/portCall/portcall-timestamp";
import {OperationsEvent} from "../../model/OVS/operations-event";
import {TimestampTypeToEventClassifierCodePipe} from "./timestamp-type-to-event-classifier-code.pipe";
import {TimestampTypeToEventTypePipe} from "./timestamp-type-to-event-type.pipe";
import {TimestampTypeToFacilityCodeCodePipe} from "./timestamp-type-to-facility-code-type.pipe";
import {EventClassifierCode} from "../../model/OVS/eventClassifierCode";
import {EventType} from "../../model/OVS/eventType";
import {FacilityCodeType} from "../../model/OVS/facilityCodeType";
import {OperationsEventTypeCode} from "../../model/OVS/operationsEventTypeCode";
import {PortCallServiceTypeCode} from "../../model/OVS/portCallServiceTypeCode";
import {PartyFunction} from "../../model/OVS/partyFunction";
import {TimestampTypeToPortcallServiceTypeCodePipe} from "./timestamp-type-to-portcall-service-type-code.pipe";
import {Config} from "../../model/OVS/config";
import { TransportCall } from 'src/app/model/OVS/transport-call';

@Pipe({
  name: 'timestampsToTransportEvents'
})
export class TimestampsToOperationsEventsPipe implements PipeTransform {

  transform(portcallTimestamp: PortcallTimestamp, configurations: Config): OperationsEvent {
    let operationsEvent: OperationsEvent = new class implements OperationsEvent {
      changeRemark: string;
      delayReasonCode: string;
      eventClassifierCode: EventClassifierCode;
      eventCreatedDateTime: string | Date;
      eventDateTime: string | Date;
      eventID: string;
      eventLocation: string;
      eventType: EventType;
      facilityTypeCode: FacilityCodeType;
      operationsEventTypeCode: OperationsEventTypeCode;
      portCallServiceTypeCode: PortCallServiceTypeCode;
      publisher: string;
      publisherRole: PartyFunction;
      transportCallID: string;
      transportCall: TransportCall;
    }

    operationsEvent.eventCreatedDateTime = portcallTimestamp.logOfTimestamp;
    operationsEvent.eventDateTime = portcallTimestamp.eventTimestamp;
    operationsEvent.eventLocation = portcallTimestamp.locationId;
    operationsEvent.changeRemark = portcallTimestamp.changeComment;
    operationsEvent.delayReasonCode = (portcallTimestamp.delayCode?portcallTimestamp.delayCode.toString():null);
    operationsEvent.eventClassifierCode = new TimestampTypeToEventClassifierCodePipe().transform(portcallTimestamp.timestampType);
    operationsEvent.operationsEventTypeCode = new TimestampTypeToEventTypePipe().transform(portcallTimestamp.timestampType)
    operationsEvent.facilityTypeCode = new TimestampTypeToFacilityCodeCodePipe().transform(portcallTimestamp.timestampType)
    operationsEvent.portCallServiceTypeCode = new TimestampTypeToPortcallServiceTypeCodePipe().transform(portcallTimestamp.timestampType);
    operationsEvent.transportCallID = portcallTimestamp.transportCallID;
    operationsEvent.eventType = EventType.OPERATIONS;

    operationsEvent.publisherRole = configurations.publisherRole;
    operationsEvent.publisher = configurations.publisher;




    return operationsEvent;
  }



}
