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
      carrierVoyageNumber: string;

    }

    newTimestamp.publisher = configurations.publisher;
    newTimestamp.publisherRole = portcallTimestamp.publisherRole;
    newTimestamp.vesselIMONumber = portcallTimestamp.vesselIMONumber;
    newTimestamp.vessel = portcallTimestamp.vessel;
    newTimestamp.carrierServiceCode = portcallTimestamp.carrierServiceCode;
    newTimestamp.exportVoyageNumber = portcallTimestamp.exportVoyageNumber;
    newTimestamp.importVoyageNumber = portcallTimestamp.importVoyageNumber;
    newTimestamp.portVisitReference = portcallTimestamp.portVisitReference;
    newTimestamp.carrierExportVoyageNumber = portcallTimestamp.carrierExportVoyageNumber;
    newTimestamp.carrierImportVoyageNumber = portcallTimestamp.carrierImportVoyageNumber;
    newTimestamp.transportCallSequenceNumber = portcallTimestamp.transportCallSequenceNumber
    newTimestamp.vesselPosition = portcallTimestamp.vesselPosition;
    newTimestamp.UNLocationCode = portcallTimestamp.UNLocationCode;
    newTimestamp.facilitySMDGCode = portcallTimestamp.facilitySMDGCode;
    newTimestamp.eventLocation = portcallTimestamp.eventLocation;
    newTimestamp.modeOfTransport = portcallTimestamp.modeOfTransport;
    newTimestamp.eventDateTime = portcallTimestamp.eventDateTime;
    newTimestamp.portCallSequence = portcallTimestamp.portCallSequence;
    newTimestamp.carrierVoyageNumber = portcallTimestamp.carrierVoyageNumber;
    newTimestamp.remark = portcallTimestamp.remark;
    newTimestamp.delayReasonCode = portcallTimestamp.delayReasonCode;
    // values dependent on timestampDefinitionTO
    newTimestamp.facilityTypeCode = portcallTimestamp.timestampDefinitionTO.facilityTypeCode;
    newTimestamp.eventClassifierCode = portcallTimestamp.timestampDefinitionTO.eventClassifierCode;
    newTimestamp.operationsEventTypeCode = portcallTimestamp.timestampDefinitionTO.operationsEventTypeCode;
    newTimestamp.portCallServiceTypeCode = portcallTimestamp.timestampDefinitionTO.portCallServiceTypeCode;
    newTimestamp.portCallPhaseTypeCode = portcallTimestamp.timestampDefinitionTO.portCallPhaseTypeCode;

    return newTimestamp;
  }
}