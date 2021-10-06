import {Pipe, PipeTransform} from '@angular/core';
import {TimestampTypeToEventClassifierCodePipe} from "./timestamp-type-to-event-classifier-code.pipe";
import {TimestampTypeToEventTypePipe} from "./timestamp-type-to-event-type.pipe";
import {TimestampTypeToFacilityCodeCodePipe} from "./timestamp-type-to-facility-code-type.pipe";
import {EventClassifierCode} from "../../model/ovs/eventClassifierCode";
import {OperationsEventTypeCode} from "../../model/ovs/operationsEventTypeCode";
import {PortCallServiceTypeCode} from "../../model/enums/portCallServiceTypeCode";
import {TimestampTypeToPortcallServiceTypeCodePipe} from "./timestamp-type-to-portcall-service-type-code.pipe";
import {Config} from "../../model/ovs/config";
import {TransportCall} from 'src/app/model/ovs/transport-call';
import {Publisher} from 'src/app/model/publisher';
import {PublisherRole} from 'src/app/model/enums/publisherRole';
import {FacilityTypeCode} from 'src/app/model/enums/facilityTypeCodeOPR';
import {Timestamp} from 'src/app/model/ovs/timestamp';
import {identifyingCodes} from 'src/app/model/portCall/identifyingCodes';


@Pipe({
  name: 'timestampToStandardizedtTimestamp'
})
export class TimestampToStandardizedtTimestampPipe implements PipeTransform {

  transform(portcallTimestamp: Timestamp, configurations: Config): Timestamp {

    let newTimestamp: Timestamp = new class implements Timestamp {
      publisher: Publisher;
      publisherRole: PublisherRole;
      vesselIMONumber: string;
      UNLocationCode: string;
      delayReasonCode: string;
      eventClassifierCode: EventClassifierCode;
      eventDateTime: Date;
      facilityTypeCode: FacilityTypeCode;
      operationsEventTypeCode: OperationsEventTypeCode;
      portCallServiceTypeCode: PortCallServiceTypeCode;
      transportCallID: string;
      transportCall: TransportCall;
      identifyingCodes?: identifyingCodes;

    }

    newTimestamp.publisher = configurations.publisher;
    newTimestamp.publisherRole = configurations.publisherRole;
    newTimestamp.vesselIMONumber = portcallTimestamp.vesselIMONumber;
    newTimestamp.UNLocationCode = portcallTimestamp.UNLocationCode;
    newTimestamp.facilitySMDGCode = portcallTimestamp.facilitySMDGCode;
    newTimestamp.facilityTypeCode = new TimestampTypeToFacilityCodeCodePipe().transform(portcallTimestamp.timestampType);
    newTimestamp.eventClassifierCode = new TimestampTypeToEventClassifierCodePipe().transform(portcallTimestamp.timestampType);
    newTimestamp.operationsEventTypeCode = new TimestampTypeToEventTypePipe().transform(portcallTimestamp.timestampType);
    newTimestamp.eventLocation = portcallTimestamp.eventLocation;
    newTimestamp.vesselPosition = portcallTimestamp.vesselPosition;
    newTimestamp.modeOfTransport = portcallTimestamp.modeOfTransport;
    newTimestamp.portCallServiceTypeCode = new TimestampTypeToPortcallServiceTypeCodePipe().transform(portcallTimestamp.timestampType);
    newTimestamp.eventDateTime = portcallTimestamp.eventDateTime;
    newTimestamp.carrierVoyageNumber = portcallTimestamp.carrierVoyageNumber;
    newTimestamp.carrierServiceCode = portcallTimestamp.carrierServiceCode;
    newTimestamp.portCallSequence = portcallTimestamp.portCallSequence;
    newTimestamp.remark = portcallTimestamp.remark;
    newTimestamp.delayReasonCode = portcallTimestamp.delayReasonCode;

    return newTimestamp;
  }
}
