import {Pipe, PipeTransform} from '@angular/core';
import {OperationsEvent} from "../../model/OVS/operations-event";
import {PortcallTimestamp} from "../../model/portCall/portcall-timestamp";
import {DelayCode} from "../../model/portCall/delayCode";
import {MessageDirection} from "../../model/portCall/messageDirection";
import {Port} from "../../model/portCall/port";
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {Terminal} from "../../model/portCall/terminal";
import {Vessel} from "../../model/portCall/vessel";
import {OperationsEventToTimestampTypePipe} from "./operations-event-to-timestamp-type.pipe";
import {PartyFunction} from "../../model/OVS/partyFunction";

@Pipe({
  name: 'transportEventToTimestamp'
})
export class OperationsEventToTimestampPipe implements PipeTransform {

  transform(operationsEvent: OperationsEvent): PortcallTimestamp {
    let timestamp: PortcallTimestamp;
    timestamp = new class implements PortcallTimestamp {
      callSequence: number;
      changeComment: string;
      classifierCode: string;
      delayCode: DelayCode | string;
      direction: string;
      eventTimestamp: string | Date;
      eventTypeCode: string;
      id: string;
      locationId: string;
      locationType: string;
      logOfTimestamp: string | Date;
      messageDirection: MessageDirection;
      messagingDetails: string;
      messagingStatus: string;
      modifiable: boolean;
      outdatedMessage: boolean;
      portNext: Port | number;
      portOfCall: Port | number;
      portPrevious: Port | number;
      publisher: string;
      publisherRole: PartyFunction;
      response: PortcallTimestampType;
      sequenceColor: string;
      terminal: Terminal | number;
      timestampType: PortcallTimestampType;
      transportCallID: string;
      uiReadByUser: boolean;
      vessel: number | Vessel;
    }

    timestamp.id = operationsEvent.eventID;
    timestamp.timestampType = this.getTimestampType(operationsEvent);
    timestamp.classifierCode = operationsEvent.eventClassifierCode;
    timestamp.eventTypeCode = operationsEvent.operationsEventTypeCode;
    timestamp.locationType = (!operationsEvent.portCallServiceTypeCode ?
      operationsEvent.facilityTypeCode : operationsEvent.portCallServiceTypeCode);
    timestamp.callSequence = 0;
    timestamp.logOfTimestamp = operationsEvent.eventCreatedDateTime;
    timestamp.eventTimestamp = operationsEvent.eventDateTime;
    timestamp.changeComment = operationsEvent.changeRemark;
    timestamp.transportCallID = operationsEvent.transportCallID;
    timestamp.locationId = operationsEvent.eventLocation;
    timestamp.uiReadByUser = true;
    timestamp.delayCode = operationsEvent.delayReasonCode;
    timestamp.publisher = operationsEvent.publisher;
    timestamp.publisherRole = operationsEvent.publisherRole;


    return timestamp;
  }


  private getTimestampType(transportEvent: OperationsEvent): PortcallTimestampType {
    const timestampTypeMapping: OperationsEventToTimestampTypePipe = new OperationsEventToTimestampTypePipe();
    return timestampTypeMapping.transform(transportEvent);
  }

}