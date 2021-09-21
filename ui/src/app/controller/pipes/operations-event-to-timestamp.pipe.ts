import {Pipe, PipeTransform} from '@angular/core';
import {OperationsEvent} from "../../model/ovs/operations-event";
import {PortcallTimestamp} from "../../model/portCall/portcall-timestamp";
import {DelayCode} from "../../model/portCall/delayCode";
import {MessageDirection} from "../../model/portCall/messageDirection";
import {Port} from "../../model/portCall/port";
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {Terminal} from "../../model/portCall/terminal";
import {Vessel} from "../../model/portCall/vessel";
import {OperationsEventToTimestampTypePipe} from "./operations-event-to-timestamp-type.pipe";
import {Timestamp} from 'src/app/model/ovs/timestamp';
import {Publisher} from 'src/app/model/publisher';
import {PublisherRole} from 'src/app/model/enums/publisherRole';
import {FacilityTypeCode} from 'src/app/model/enums/facilityTypeCodeOPR';
import {EventClassifierCode} from 'src/app/model/ovs/eventClassifierCode';
import {OperationsEventTypeCode} from 'src/app/model/enums/operationsEventTypeCode';

@Pipe({
  name: 'transportEventToTimestamp'
})
export class OperationsEventToTimestampPipe implements PipeTransform {

  transform(operationsEvent: OperationsEvent): Timestamp {
    let timestamp: Timestamp;
    timestamp = new class implements Timestamp {
      publisher: Publisher;
      publisherRole: PublisherRole;
      vesselIMONumber: string;
      UNLocationCode: string;
      facilityTypeCode: FacilityTypeCode;
      eventClassifierCode: EventClassifierCode;
      operationsEventTypeCode: OperationsEventTypeCode;
      eventDateTime: string | Date;
      callSequence: number;
      changeComment: string;
      classifierCode: string;
      direction: string;
      eventTimestamp: string | Date;
      eventTypeCode: string;
      id: string;
      locationId: string;
      logOfTimestamp: string | Date;
      messageDirection: MessageDirection;
      messagingDetails: string;
      messagingStatus: string;
      modifiable: boolean;
      outdatedMessage: boolean;
      portNext: Port | number;
      portOfCall: Port;
      portPrevious: Port | number;
      response: PortcallTimestampType;
      sequenceColor: string;
      terminal: Terminal | number;
      timestampType: PortcallTimestampType;
      transportCallID: string;
      uiReadByUser: boolean;
      vessel: number | Vessel;
    }

    timestamp.publisher = operationsEvent.publisher;
    timestamp.publisherRole = operationsEvent.publisherRole;

    timestamp.uiReadByUser = true;
    timestamp.publisher = operationsEvent.publisher;
    timestamp.publisherRole = operationsEvent.publisherRole;
    timestamp.eventClassifierCode = operationsEvent.eventClassifierCode;
    timestamp.operationsEventTypeCode = operationsEvent.operationsEventTypeCode;
    timestamp.eventDateTime = operationsEvent.eventDateTime;
    timestamp.portCallServiceTypeCode = operationsEvent.portCallServiceTypeCode;
    timestamp.facilityTypeCode = operationsEvent.facilityTypeCode;
    timestamp.remark = operationsEvent.remark;
    timestamp.delayReasonCode = operationsEvent.delayReasonCode;
    timestamp.eventDeliveryStatus = operationsEvent.eventDeliveryStatus;

    // Extras
    timestamp.timestampType = this.getTimestampType(operationsEvent);
    timestamp.logOfTimestamp = operationsEvent.eventCreatedDateTime;
    timestamp.transportCallID = operationsEvent.transportCall.transportCallID;

    return timestamp;
  }


  private getTimestampType(operationsEvent: OperationsEvent): PortcallTimestampType {
    const timestampTypeMapping: OperationsEventToTimestampTypePipe = new OperationsEventToTimestampTypePipe();
    return timestampTypeMapping.transform(operationsEvent);
  }

}
