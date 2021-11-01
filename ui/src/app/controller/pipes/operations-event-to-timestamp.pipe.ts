import {Pipe, PipeTransform} from '@angular/core';
import {OperationsEvent} from "../../model/ovs/operations-event";
import {MessageDirection} from "../../model/portCall/messageDirection";
import {Port} from "../../model/portCall/port";
import {Terminal} from "../../model/portCall/terminal";
import {Vessel} from "../../model/portCall/vessel";
import {Timestamp} from 'src/app/model/ovs/timestamp';
import {Publisher} from 'src/app/model/publisher';
import {PublisherRole} from 'src/app/model/enums/publisherRole';
import {FacilityTypeCode} from 'src/app/model/enums/facilityTypeCodeOPR';
import {EventClassifierCode} from 'src/app/model/ovs/eventClassifierCode';
import {OperationsEventTypeCode} from 'src/app/model/enums/operationsEventTypeCode';
import {TimestampDefinition} from "../../model/ovs/timestamp-definition";

@Pipe({
  name: 'operationsEventEventToTimestamp'
})
export class OperationsEventToTimestampPipe implements PipeTransform {

  transform(operationsEvent: OperationsEvent, timestampDefinitions: Map<string, TimestampDefinition>): Timestamp {
    let timestamp: Timestamp;
    timestamp = new class implements Timestamp {
      publisher: Publisher;
      publisherRole: PublisherRole;
      vesselIMONumber: string;
      UNLocationCode: string;
      facilityTypeCode: FacilityTypeCode;
      eventClassifierCode: EventClassifierCode;
      operationsEventTypeCode: OperationsEventTypeCode;
      eventDateTime: Date;
      callSequence: number;
      changeComment: string;
      classifierCode: string;
      direction: string;
      eventTimestamp: string | Date;
      eventTypeCode: string;
      id: string;
      logOfTimestamp: string | Date;
      messageDirection: MessageDirection;
      messagingDetails: string;
      messagingStatus: string;
      outdatedMessage: boolean;
      portNext: Port | number;
      portOfCall: Port;
      portPrevious: Port | number;
      response: TimestampDefinition;
      sequenceColor: string;
      terminal: Terminal | number;
      timestampDefinition: TimestampDefinition;
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
    if (operationsEvent.eventLocation?.facilityCodeListProvider == 'SMDG') {
      timestamp.facilitySMDGCode = operationsEvent.eventLocation?.facilityCode;
    }
    timestamp.remark = operationsEvent.remark;
    timestamp.delayReasonCode = operationsEvent.delayReasonCode;
    timestamp.eventDeliveryStatus = operationsEvent.eventDeliveryStatus;
    // Extras
    timestamp.timestampDefinition = timestampDefinitions?.get(operationsEvent.timestampDefinitionID)
    timestamp.logOfTimestamp = operationsEvent.eventCreatedDateTime;
    timestamp.transportCallID = operationsEvent.transportCall.transportCallID;
    timestamp.eventLocation = operationsEvent.eventLocation;

    return timestamp;
  }

}
