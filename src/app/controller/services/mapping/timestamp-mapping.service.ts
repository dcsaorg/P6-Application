import { Injectable } from '@angular/core';
import { OperationsEventService } from "../jit/operations-event.service";
import { Observable } from "rxjs";
import { TransportCall } from "../../../model/jit/transport-call";
import { map, mergeMap } from "rxjs/operators";
import { Globals } from "../../../model/portCall/globals";
import { OperationsEventsToTimestampsPipe } from "../../pipes/operations-events-to-timestamps.pipe";
import { Timestamp } from "../../../model/jit/timestamp";
import { TimestampService } from "../jit/timestamps.service";
import { TimestampToStandardizedtTimestampPipe } from '../../pipes/timestamp-to-standardized-timestamp';
import { NegotiationCycleService } from "../base/negotiation-cycle.service";
import { TimestampDefinitionTO } from "../../../model/jit/timestamp-definition";
import { TimestampDefinitionService } from "../base/timestamp-definition.service";
import { EventLocationRequirement } from 'src/app/model/enums/eventLocationRequirement';
import { FacilityTypeCode } from 'src/app/model/enums/facilityTypeCodeOPR';

@Injectable({
  providedIn: 'root'
})
export class TimestampMappingService {
  constructor(
    private operationsEventService: OperationsEventService,
    private globals: Globals,
    private operationsEventsToTimestampsPipe: OperationsEventsToTimestampsPipe,
    private timestampToStandardizedTimestampPipe: TimestampToStandardizedtTimestampPipe,
    private timestampDefinitionService: TimestampDefinitionService,
    private timestampService: TimestampService,
    private negotiationCycleService: NegotiationCycleService,
  ) {
  }

  private readonly locationNamePBP: string = "PBP Location Name";
  private readonly locationNameBerth: string = "Berth Location Name";
  private readonly locationNameAnchorage: string = "Anchorage Location Name";

  addPortCallTimestamp(timestamp: Timestamp): Observable<Timestamp> {
    this.ensureVoyageNumbers(timestamp);
    return this.timestampService.addTimestamp(this.timestampToStandardizedTimestampPipe.transform(timestamp, this.globals.config))
  }

  /*
  * A function that returns a list of portCall timestamps related to the transport Call .
  */
  getPortCallTimestampsByTransportCall(transportCall: TransportCall, portCallPart?: string): Observable<Timestamp[]> {
    return this.operationsEventService.getTimestampInfoForTransportCall(transportCall?.transportCallID, portCallPart).pipe(
      mergeMap(timestampInfos =>
        this.timestampDefinitionService.getTimestampDefinitionsMap().pipe(
          map(timestampDefinitionsMap => {
            const operationEvents = timestampInfos.map(timestampInfo => {
              timestampInfo.operationsEventTO.timestampDefinitionID = timestampInfo.timestampDefinitionTO.id;
              timestampInfo.operationsEventTO.eventDeliveryStatus = timestampInfo.eventDeliveryStatus;
              return timestampInfo.operationsEventTO
            });
            return this.operationsEventsToTimestampsPipe.transform(operationEvents, timestampDefinitionsMap);
          }),
          map(timestamps => {
            this.mapTransportCallToTimestamps(timestamps, transportCall);
            let set = new Set()
            for (let timestamp of timestamps) {
              if (timestamp.timestampDefinitionTO) {
                this.alignPublisherRoleAndPrimaryReceiver(timestamp);
                let negotiationCycle = this.negotiationCycleService.enrichTimestampWithNegotiationCycle(timestamp);
                const negotiationCycleKey = negotiationCycle.cycleKey;
                timestamp.isLatestInCycle = !set.has(negotiationCycleKey)
                set.add(negotiationCycleKey)
              }
            }
            return timestamps;
          })
        ))
    )

  }


  private mapTransportCallToTimestamps(timestamps: Timestamp[], transportCall: TransportCall) {

    for (let timestamp of timestamps) {
      if (timestamp.transportCallReference == transportCall.transportCallReference) {
        timestamp.transportCallID = transportCall.transportCallID;
        timestamp.vesselIMONumber = transportCall.vesselIMONumber;
        timestamp.UNLocationCode = transportCall.UNLocationCode;
        timestamp.portOfCall = transportCall.portOfCall;
        timestamp.importVoyageNumber = transportCall.importVoyageNumber;
        timestamp.exportVoyageNumber = transportCall.exportVoyageNumber;
        timestamp.carrierVoyageNumber = timestamp.carrierVoyageNumber;
        timestamp.carrierServiceCode = transportCall.carrierServiceCode;
        timestamp.transportCallSequenceNumber = transportCall.transportCallSequenceNumber;
        if (!transportCall.exportVoyageNumber && transportCall.carrierExportVoyageNumber) {
          // Receive & convert to JIT 1.1 voyage numbers
          timestamp.exportVoyageNumber = transportCall.carrierExportVoyageNumber;
          timestamp.importVoyageNumber = transportCall.carrierImportVoyageNumber;
        }
      }
    }
  }

  // Align voyageNumbers (JIT 1.x) before posting timestamp
  ensureVoyageNumbers(timestamp: Timestamp) {
    if (timestamp.carrierVoyageNumber === undefined || timestamp.carrierVoyageNumber === null) {
      if (timestamp.importVoyageNumber) { timestamp.carrierVoyageNumber = timestamp.importVoyageNumber }
      if (timestamp.exportVoyageNumber) { timestamp.carrierVoyageNumber = timestamp.exportVoyageNumber }       // we overwrite with exportVoyageNumber if exist
    }
    timestamp.importVoyageNumber = !timestamp.importVoyageNumber ? timestamp.carrierVoyageNumber : timestamp.importVoyageNumber;
    timestamp.exportVoyageNumber = !timestamp.exportVoyageNumber ? timestamp.carrierVoyageNumber : timestamp.exportVoyageNumber;
  }

  /*
      To detect the publisher role (PR) for the timestampDefinitionsTO
       We check the PR of the event against the timestampDefinitionsTO's -> publisher pattern.
       If found we set that as the timestampDefinitionsTO's PR and primary reciever.
       If not we should raise a warning as this is unexpected behavior -- for now print console.warn()
  */
  private alignPublisherRoleAndPrimaryReceiver(timestamp: Timestamp) {
    let patterns = timestamp.timestampDefinitionTO.publisherPattern;
    for (const element of patterns) {
      if (timestamp.publisherRole === element.publisherRole) {
        timestamp.timestampDefinitionTO.publisherRole = element.publisherRole;
        timestamp.timestampDefinitionTO.primaryReceiver = element.primaryReceiver;
        break;
      }
    }
    if (timestamp.timestampDefinitionTO.publisherRole === null || timestamp.timestampDefinitionTO.publisherRole === undefined
      || timestamp.timestampDefinitionTO.publisherRole !== timestamp.publisherRole) {
      console.warn("DCSA ERROR: Timestamp's publisherRole does not conform "
        + "to timestamp definition publisher pattern")
    }
  }


  getLocationNameOptionLabel(timestampType: TimestampDefinitionTO): string {
    if (timestampType?.eventLocationRequirement == EventLocationRequirement.OPTIONAL ||
      timestampType?.eventLocationRequirement == EventLocationRequirement.REQUIRED) {
    if (timestampType?.facilityTypeCode == FacilityTypeCode.BRTH) {
      return this.locationNameBerth;
    }
    if (timestampType?.facilityTypeCode == FacilityTypeCode.PBPL) {
      return this.locationNamePBP;
    }
    if (timestampType?.facilityTypeCode == FacilityTypeCode.ANCH) {
      return this.locationNameAnchorage;
    }
  }
    return undefined;
  }
}



