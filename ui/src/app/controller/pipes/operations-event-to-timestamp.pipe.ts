import {Pipe, PipeTransform} from '@angular/core';
import {OperationsEvent} from "../../model/OVS/operations-event";
import {PortcallTimestamp} from "../../model/base/portcall-timestamp";
import {DelayCode} from "../../model/base/delayCode";
import {MessageDirection} from "../../model/base/messageDirection";
import {Port} from "../../model/base/port";
import {PortcallTimestampType} from "../../model/base/portcall-timestamp-type.enum";
import {Terminal} from "../../model/base/terminal";
import {Vessel} from "../../model/base/vessel";
import {OperationsEventToTimestampTypePipe} from "./operations-event-to-timestamp-type.pipe";

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
      delayCode: string;
      direction: string;
      eventTimestamp: string | Date;
      eventTypeCode: string;
      locationType;
      id: string;
      locationId: string;
      logOfTimestamp: string | Date;
      messageDirection: MessageDirection;
      messagingDetails: string;
      messagingStatus: string;
      modifiable: boolean;
      outdatedMessage: boolean;
      portNext: Port | number;
      portOfCall: Port | number;
      portPrevious: Port | number;
      response: PortcallTimestampType;
      sequenceColor: string;
      terminal: Terminal | number;
      timestampType: PortcallTimestampType;
      transportCallID: string;
      uiReadByUser: boolean;
      vessel: number | Vessel;
    };

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


    return timestamp;


  }


  private getTimestampType(transportEvent: OperationsEvent): PortcallTimestampType {
    const timestampTypeMapping: OperationsEventToTimestampTypePipe = new OperationsEventToTimestampTypePipe();
    return timestampTypeMapping.transform(transportEvent);
  }

}
