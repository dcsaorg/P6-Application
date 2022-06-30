import {Pipe, PipeTransform} from '@angular/core';
import {EventClassifierCode} from "../../model/jit/eventClassifierCode";
import {OperationsEventTypeCode} from "../../model/enums/operationsEventTypeCode";
import {PortCallServiceTypeCode} from "../../model/enums/portCallServiceTypeCode";
import {Config} from "../../model/jit/config";
import {TransportCall} from 'src/app/model/jit/transport-call';
import {Publisher} from 'src/app/model/publisher';
import {PublisherRole} from 'src/app/model/enums/publisherRole';
import {FacilityTypeCode} from 'src/app/model/enums/facilityTypeCodeOPR';
import {Timestamp} from 'src/app/model/jit/timestamp';
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
      transportCallReference: string;

    }

    newTimestamp.publisher = configurations.publisher;
    newTimestamp.publisherRole = portcallTimestamp.timestampDefinition.publisherRole;
    newTimestamp.vesselIMONumber = portcallTimestamp.vesselIMONumber;
    newTimestamp.UNLocationCode = portcallTimestamp.UNLocationCode;
    newTimestamp.facilitySMDGCode = portcallTimestamp.facilitySMDGCode;
    newTimestamp.facilityTypeCode = portcallTimestamp.timestampDefinition.facilityTypeCode;
    newTimestamp.eventClassifierCode = portcallTimestamp.timestampDefinition.eventClassifierCode;
    newTimestamp.operationsEventTypeCode = portcallTimestamp.timestampDefinition.operationsEventTypeCode;
    newTimestamp.eventLocation = portcallTimestamp.eventLocation;
    newTimestamp.vesselPosition = portcallTimestamp.vesselPosition;
    newTimestamp.modeOfTransport = portcallTimestamp.modeOfTransport;
    newTimestamp.portCallServiceTypeCode = portcallTimestamp.timestampDefinition.portCallServiceTypeCode;
    newTimestamp.portCallPhaseTypeCode = portcallTimestamp.timestampDefinition.portCallPhaseTypeCode;
    newTimestamp.eventDateTime = portcallTimestamp.eventDateTime;
    newTimestamp.exportVoyageNumber = portcallTimestamp.exportVoyageNumber;
    newTimestamp.importVoyageNumber = portcallTimestamp.importVoyageNumber;
    newTimestamp.carrierServiceCode = portcallTimestamp.carrierServiceCode;
    newTimestamp.portCallSequence = portcallTimestamp.portCallSequence;
    newTimestamp.remark = portcallTimestamp.remark;
    newTimestamp.delayReasonCode = portcallTimestamp.delayReasonCode;

    return newTimestamp;
  }
}
