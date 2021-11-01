import {Injectable} from '@angular/core';
import {OperationsEventService} from "../jit/operations-event.service";
import {Observable} from "rxjs";
import {TransportCall} from "../../../model/jit/transport-call";
import {map, mergeMap} from "rxjs/operators";
import {Globals} from "../../../model/portCall/globals";
import {OperationsEventsToTimestampsPipe} from "../../pipes/operations-events-to-timestamps.pipe";
import {Timestamp} from "../../../model/jit/timestamp";
import {TimestampService} from "../jit/timestamps.service";
import {TimestampToStandardizedtTimestampPipe} from '../../pipes/timestamp-to-standardized-timestamp';
import {NegotiationCycleService} from "../base/negotiation-cycle.service";
import {TimestampInfo} from "../../../model/jit/timestampInfo";
import {TimestampDefinition} from "../../../model/jit/timestamp-definition";
import {TimestampDefinitionService} from "../base/timestamp-definition.service";
import {OperationsEvent} from "../../../model/jit/operations-event";


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

  getPortCallTimestampsByTransportCall(transportCall: TransportCall): Observable<Timestamp[]> {
    return this.operationsEventService.getOperationsEventsByTransportCall(transportCall.transportCallID).pipe(
      mergeMap((events) =>
        this.operationsEventService.getTimestampInfoForTransportCall(transportCall.transportCallID).pipe(
          map((deliveryStatuses) => {
            let map = new Map<string, TimestampInfo>();
            for (let status of deliveryStatuses) {
              map.set(status.eventID, status);
            }
            for (let event of events) {
              const eventDelivery = map.get(event.eventID);
              if (eventDelivery) {
                event.timestampDefinitionID = eventDelivery.timestampDefinition;
                event.eventDeliveryStatus = eventDelivery.eventDeliveryStatus
              } else {
                event.eventDeliveryStatus = 'DELIVERY_FINISHED'
                event.timestampDefinitionID = 'BAD_TIMESTAMP'
              }
            }
            return events;
          })
        ),
      ),
      mergeMap(events => this.timestampDefinitionService.getTimestampDefinitionsMap().pipe(
        map(timestampDefinitions => {
          const timestamps = this.operationsEventsToTimestampsPipe.transform(events, timestampDefinitions)
          this.mapTransportCallToTimestamps(timestamps, transportCall);
          return timestamps;
        })
      )),
      map(timestamps => {
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
      }))
  }

  private mapTransportCallToTimestamps(timestamps: Timestamp[], transportCall: TransportCall) {

    for (let timestamp of timestamps) {
      if (timestamp.transportCallID == transportCall.transportCallID) {
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



