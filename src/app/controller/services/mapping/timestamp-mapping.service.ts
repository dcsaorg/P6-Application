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
import { TimestampDefinition } from "../../../model/jit/timestamp-definition";
import { TimestampDefinitionService } from "../base/timestamp-definition.service";

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

  addPortCallTimestamp(timestamp: Timestamp): Observable<Timestamp> {
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
            const operationEvents = timestampInfos.map(timestampInfo => timestampInfo.operationsEventTO);
            return this.operationsEventsToTimestampsPipe.transform(operationEvents, timestampDefinitionsMap);
          }),
          map(timestamps => {
            this.mapTransportCallToTimestamps(timestamps, transportCall);
            let set = new Set()
            for (let timestamp of timestamps) {
              if (timestamp.timestampDefinition) {
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
        timestamp.carrierServiceCode = transportCall.carrierServiceCode;
      }
    }
  }

  getLocationNameOptionLabel(timestampType: TimestampDefinition): string {
    if (timestampType?.isBerthLocationNeeded) {
      return this.locationNameBerth;
    }
    if (timestampType?.isPBPLocationNeeded) {
      return this.locationNamePBP;
    }
    return undefined;
  }
}



