import {Pipe, PipeTransform} from '@angular/core';
import {PortcallTimestamp} from "../../model/portCall/portcall-timestamp";
import {OperationsEvent} from "../../model/ovs/operations-event";
import {TimestampTypeToEventClassifierCodePipe} from "./timestamp-type-to-event-classifier-code.pipe";
import {TimestampTypeToEventTypePipe} from "./timestamp-type-to-event-type.pipe";
import {TimestampTypeToFacilityCodeCodePipe} from "./timestamp-type-to-facility-code-type.pipe";
import {EventClassifierCode} from "../../model/ovs/eventClassifierCode";
import {EventType} from "../../model/ovs/eventType";
import {OperationsEventTypeCode} from "../../model/ovs/operationsEventTypeCode";
import {PortCallServiceTypeCode} from "../../model/enums/portCallServiceTypeCode";
import {TimestampTypeToPortcallServiceTypeCodePipe} from "./timestamp-type-to-portcall-service-type-code.pipe";
import {Config} from "../../model/ovs/config";
import { TransportCall } from 'src/app/model/ovs/transport-call';
import { Publisher } from 'src/app/model/publisher';
import { PublisherRole } from 'src/app/model/enums/publisherRole';
import { FacilityTypeCode } from 'src/app/model/enums/facilityTypeCodeOPR';
import { Timestamp } from 'src/app/model/ovs/timestamp';


@Pipe({
  name: 'timestampsToTransportEvents'
})

export class TimestampsToOperationsEventsPipe implements PipeTransform {

  transform(portcallTimestamp: Timestamp, configurations: Config): OperationsEvent {
    /*
    let operationsEvent: OperationsEvent = new class implements OperationsEvent {
      changeRemark: string;
      delayReasonCode: string;
      eventClassifierCode: EventClassifierCode;
      eventCreatedDateTime: string | Date;
      eventDateTime: string | Date;
      eventID: string;
      eventLocation: string;
      eventType: EventType;
      facilityTypeCode: FacilityTypeCode;
      operationsEventTypeCode: OperationsEventTypeCode;
      portCallServiceTypeCode: PortCallServiceTypeCode;
      publisher: Publisher;
      publisherRole: PublisherRole;
      transportCallID: string;
      transportCall: TransportCall;
    }

    operationsEvent.eventCreatedDateTime = portcallTimestamp.logOfTimestamp;
    operationsEvent.eventDateTime = portcallTimestamp.eventDateTime;
    operationsEvent.delayReasonCode = (portcallTimestamp.delayReasonCode);
    operationsEvent.eventClassifierCode = new TimestampTypeToEventClassifierCodePipe().transform(portcallTimestamp.timestampType);
    operationsEvent.operationsEventTypeCode = new TimestampTypeToEventTypePipe().transform(portcallTimestamp.timestampType)
    operationsEvent.facilityTypeCode = new TimestampTypeToFacilityCodeCodePipe().transform(portcallTimestamp.timestampType)
    operationsEvent.portCallServiceTypeCode = new TimestampTypeToPortcallServiceTypeCodePipe().transform(portcallTimestamp.timestampType);
    operationsEvent.transportCallID = portcallTimestamp.transportCallID;
    operationsEvent.eventType = EventType.OPERATIONS;

    operationsEvent.publisherRole = configurations.publisherRole;
    operationsEvent.publisher = configurations.publisher;



    console.log("timestamp fired below")
    console.log(operationsEvent)
    return operationsEvent;
    */
   return null; 
  }



}
