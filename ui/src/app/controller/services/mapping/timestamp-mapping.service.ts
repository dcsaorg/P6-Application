import {Injectable} from '@angular/core';
import {OperationsEventService} from "../ovs/operations-event.service";
import {Observable} from "rxjs";
import {TransportCall} from "../../../model/ovs/transport-call";
import {map, mergeMap} from "rxjs/operators";
import {Globals} from "../../../model/portCall/globals";
import {OperationsEventsToTimestampsPipe} from "../../pipes/operations-events-to-timestamps.pipe";
import {Timestamp} from "../../../model/ovs/timestamp";
import {TimestampService} from "../ovs/timestamps.service";
import {TimestampToStandardizedtTimestampPipe} from '../../pipes/timestamp-to-standardized-timestamp';
import {PublisherRole} from 'src/app/model/enums/publisherRole';
import {PortcallTimestampType} from 'src/app/model/portCall/portcall-timestamp-type.enum';
import {NegotiationCycleService} from "../base/negotiation-cycle.service";
import {EventDelivery} from "../../../model/ovs/eventDelivery";


@Injectable({
  providedIn: 'root'
})
export class TimestampMappingService {
  constructor(
              private operationsEventService: OperationsEventService,
              private globals: Globals,
              private operationsEventsToTimestampsPipe: OperationsEventsToTimestampsPipe,
              private timestampToStandardizedTimestampPipe: TimestampToStandardizedtTimestampPipe,
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
        this.operationsEventService.getEventDeliveryStatusForTransportCall(transportCall.transportCallID).pipe(
          map((deliveryStatuses) => {
            let map = new Map<string, EventDelivery>();
            for (let status of deliveryStatuses) {
              map.set(status.eventID, status);
            }
            for (let event of events) {
              const eventDelivery = map.get(event.eventID);
              if (eventDelivery) {
                event.eventDeliveryStatus = eventDelivery.eventDeliveryStatus
              } else {
                event.eventDeliveryStatus = 'DELIVERY_FINISHED'
              }
            }
            return events;
          })
        )
      ),
      map(events => {
        const timestamps = this.operationsEventsToTimestampsPipe.transform(events)
        this.mapTransportCallToTimestamps(timestamps, transportCall);

        let set = new Set()

        for (let timestamp of timestamps) {
          if (timestamp.timestampType) {
            let negotiationCycle = this.negotiationCycleService.enrichTimestampWithNegotiationCycle(timestamp);
            const negotiationCycleKey = negotiationCycle.cycleKey;
            timestamp.isLatestInCycle = !set.has(negotiationCycleKey)
            set.add(negotiationCycleKey)
            if (timestamp.isLatestInCycle) {
              timestamp.response = this.timestampService.setResponseType(timestamp, this.globals.config.publisherRole); // set response for latest timestamp in negotiationCycle.
            }
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
        timestamp.carrierVoyageNumber = transportCall.carrierVoyageNumber;
        timestamp.carrierServiceCode = transportCall.carrierServiceCode;
      }
    }
  }

  HideTerminalOptions(timestampType: PortcallTimestampType): boolean {
    switch (timestampType) {
      case PortcallTimestampType.ETA_PBP:
      case PortcallTimestampType.RTA_PBP:
      case PortcallTimestampType.PTA_PBP:
      case PortcallTimestampType.ATA_PBP:
      case PortcallTimestampType.SOSP:
      case PortcallTimestampType.EOSP:
      case PortcallTimestampType.ATC_Pilotage:
        return true;
      default:
        return false;
    }
  }

  getLocationNameOptionLabel(timestampType: PortcallTimestampType): string {
    switch (timestampType) {
      case PortcallTimestampType.ETA_Berth:
        return undefined;
      case PortcallTimestampType.RTA_Berth:
      case PortcallTimestampType.PTA_Berth:
        return this.locationNameBerth;
      case PortcallTimestampType.ETA_PBP:
      case PortcallTimestampType.RTA_PBP:
      case PortcallTimestampType.PTA_PBP:
      case PortcallTimestampType.ATA_PBP:
        return this.locationNamePBP;
      case PortcallTimestampType.ATS_Pilotage:
      case PortcallTimestampType.ATA_Berth:
      case PortcallTimestampType.ATS_Cargo_Ops:
      case PortcallTimestampType.ETC_Cargo_Ops:
      case PortcallTimestampType.RTC_Cargo_Ops:
      case PortcallTimestampType.PTC_Cargo_Ops:
      case PortcallTimestampType.ETD_Berth:
      case PortcallTimestampType.RTD_Berth:
      case PortcallTimestampType.PTD_Berth:
      case PortcallTimestampType.ATC_Cargo_Ops:
      case PortcallTimestampType.ATD_Berth:

        return this.locationNameBerth;
      default:
        return undefined;
    }
  }

  getPortcallTimestampTypes(publisherRole: PublisherRole, enableJIT1_1Timestamps: Boolean = false): string[] {
    if (enableJIT1_1Timestamps) {
      switch (publisherRole) {
        case PublisherRole.CA:
          return [
            PortcallTimestampType.ETA_Berth,
            PortcallTimestampType.PTA_Berth,
            PortcallTimestampType.ETA_PBP,
            PortcallTimestampType.PTA_PBP,
            PortcallTimestampType.ATA_PBP,
            PortcallTimestampType.RTC_Cargo_Ops,
            PortcallTimestampType.ETD_Berth,
            PortcallTimestampType.PTD_Berth,
            PortcallTimestampType.ATD_Berth,
            PortcallTimestampType.RTS_Cargo_Ops,
            PortcallTimestampType.RTS_Bunkering,
            PortcallTimestampType.RTC_Bunkering,
            PortcallTimestampType.AT_All_Fast,
            PortcallTimestampType.Gangway_Down_and_Safe,
            PortcallTimestampType.Vessel_Readiness_for_Cargo_Ops,
            PortcallTimestampType.SOSP,
            PortcallTimestampType.EOSP
          ]
        case PublisherRole.TR:
          return [
            PortcallTimestampType.RTA_Berth,
            PortcallTimestampType.ATA_Berth,
            PortcallTimestampType.ETS_Cargo_Ops,
            PortcallTimestampType.ATS_Cargo_Ops,
            PortcallTimestampType.ETC_Cargo_Ops,
            PortcallTimestampType.PTC_Cargo_Ops,
            PortcallTimestampType.ATC_Cargo_Ops,
            PortcallTimestampType.PTS_Cargo_Ops,
            PortcallTimestampType.Terminal_Ready_for_Vessel_Departure
          ]
        case PublisherRole.ATH:
          return [
            PortcallTimestampType.RTA_PBP,
            PortcallTimestampType.RTD_Berth,
          ]
        case PublisherRole.PLT:
          return [
            PortcallTimestampType.ATS_Pilotage,
            PortcallTimestampType.ATC_Pilotage,
            PortcallTimestampType.PTS_Pilotage
          ]
        case PublisherRole.LSH:
          return [
            PortcallTimestampType.ATC_Lashing,
          ]
        case PublisherRole.BUK:
          return [
            PortcallTimestampType.ATC_Bunkering,
            PortcallTimestampType.ATS_Bunkering,
            PortcallTimestampType.PTC_Bunkering,
            PortcallTimestampType.PTS_Bunkering,
            PortcallTimestampType.ETC_Bunkering,
            PortcallTimestampType.ETS_Bunkering,
          ]
        case PublisherRole.TWG:
          return [
            PortcallTimestampType.ATC_Towage,
            PortcallTimestampType.ATS_Towage,
            PortcallTimestampType.PTS_Towage,
          ]
        default:
          return [];
      }
    }
    else{
      switch (publisherRole) {
        case PublisherRole.CA:
          return [
            PortcallTimestampType.ETA_Berth,
            PortcallTimestampType.PTA_Berth,
            PortcallTimestampType.ETA_PBP,
            PortcallTimestampType.PTA_PBP,
            PortcallTimestampType.ATA_PBP,
            PortcallTimestampType.ATA_Berth,
            PortcallTimestampType.RTC_Cargo_Ops,
            PortcallTimestampType.ETD_Berth,
            PortcallTimestampType.PTD_Berth,
            PortcallTimestampType.ATD_Berth,
          ]
        case PublisherRole.TR:
          return [
            PortcallTimestampType.RTA_Berth,
            PortcallTimestampType.ATS_Cargo_Ops,
            PortcallTimestampType.ETC_Cargo_Ops,
            PortcallTimestampType.PTC_Cargo_Ops,
            PortcallTimestampType.ATC_Cargo_Ops,
          ]
        case PublisherRole.ATH:
          return [
            PortcallTimestampType.RTA_PBP,
            PortcallTimestampType.RTD_Berth,
          ]
        case PublisherRole.PLT:
          return [
            PortcallTimestampType.ATS_Pilotage,
          ]
        default:
          return [];
      }
    }
  }

}



