import {Injectable} from '@angular/core';
import {TransportCallService} from "../ovs/transport-call.service";
import {OperationsEventService} from "../ovs/operations-event.service";
import {from, Observable} from "rxjs";
import {TransportCall} from "../../../model/ovs/transport-call";
import {Port} from "../../../model/portCall/port";
import {concatMap, map, mergeMap, toArray} from "rxjs/operators";
import {Globals} from "../../../model/portCall/globals";
import {OperationsEventsToTimestampsPipe} from "../../pipes/operations-events-to-timestamps.pipe";
import {Terminal} from "../../../model/portCall/terminal";
import {Timestamp} from "../../../model/ovs/timestamp";
import {TimestampService} from "../ovs/timestamps.service";
import {TimestampToStandardizedtTimestampPipe} from '../../pipes/timestamp-to-standardized-timestamp';
import {PublisherRole} from 'src/app/model/enums/publisherRole';
import {PortcallTimestampType} from 'src/app/model/portCall/portcall-timestamp-type.enum';


@Injectable({
  providedIn: 'root'
})
export class TimestampMappingService {
  constructor(private transportCallService: TransportCallService,
              private operationsEventService: OperationsEventService,
              private globals: Globals,
              private operationsEventsToTimestampsPipe: OperationsEventsToTimestampsPipe,
              private timestampToStandardizedtTimestampPipe: TimestampToStandardizedtTimestampPipe,
              private timestampService: TimestampService
  ) {
  }

  private readonly locationNamePBP: string = "PBP Location Name";
  private readonly locationNameBerth: string = "Berth Location Name";

  addPortCallTimestamp(timestamp: Timestamp): Observable<Timestamp> {
    return this.timestampService.addTimestamp(this.timestampToStandardizedtTimestampPipe.transform(timestamp, this.globals.config))
  }

  getPortCallTimestamps(): Observable<Timestamp[]> {
    return this.operationsEventService.getOperationsEvents().pipe(map(events => {
      const timestamps = this.operationsEventsToTimestampsPipe.transform(events);
      this.loadTransportCalls(timestamps)
      return timestamps;
    }));
  }

  getPortCallTimestampsByTransportCall(transportCall: TransportCall): Observable<Timestamp[]> {
    return this.operationsEventService.getOperationsEventsByTransportCall(transportCall.transportCallID).pipe(
      mergeMap(events => {
        return from(events).pipe(
          concatMap(operationsEvent => {
            return this.operationsEventService.getEventDeliveryStatus(operationsEvent.eventID).pipe(
              map(eventDelivery => {
                operationsEvent.eventDeliveryStatus = eventDelivery.eventDeliveryStatus
                return operationsEvent
              })
            )
          }),
          toArray()
        )
      }),
      map(events => {
        const timestamps = this.operationsEventsToTimestampsPipe.transform(events)
        this.mapTransportCallToTimestamps(timestamps, transportCall);

        let set = new Set()

        for (let timestamp of timestamps) {
          if (timestamp.timestampType) {
            let negotiationCycle = timestamp.timestampType.substring(1)
            timestamp.isLatestInCycle = !set.has(negotiationCycle)
            set.add(negotiationCycle)
            if (timestamp.isLatestInCycle) {
              this.timestampService.setResponseType(timestamp, this.globals.config.publisherRole); // set response for latest timestamp in negotiationCycle.
            }
          }
        }
        return timestamps;
      }))
  }

  getPortByUnLocode(unlocode: string): Port {
    for (let port of this.globals.ports) {
      if (port.unLocode == unlocode) {
        return port;
      }
    }
    return null;
  }

  getTerminalByFacilityCode(facilityCode: string): Terminal {
    const smdgCode = facilityCode;
    for (let terminal of this.globals.terminals) {
      if (terminal.smdgCode == smdgCode) {
        return terminal
      }
    }
    return null;
  }


  private loadTransportCalls(timestamps: Timestamp[]) {
    // get TransportCallIds to be loaded
    const transportCallIDs: string[] = Array.from([...new Set(timestamps.map(timestamp => timestamp.transportCallID))]);
    this.callTransportCalls(transportCallIDs, timestamps)
  }

  private callTransportCalls(transportCallIDs: string[], timestamps: Timestamp[]): Observable<TransportCall[]> {
    // load all required transportCalls
    from(transportCallIDs).subscribe(transportCallID => {
      this.transportCallService.getTransportCallsById(transportCallID).subscribe(transportCall => this.mapTransportCallToTimestamps(timestamps, transportCall));
    });
    return null;
  }

  private mapTransportCallToTimestamps(timestamps: Timestamp[], transportCall: TransportCall) {

    for (let timestamp of timestamps) {
      if (timestamp.transportCallID == transportCall.transportCallID) {
        timestamp.portOfCall = this.getPortByUnLocode(transportCall.UNLocationCode);
        timestamp.vesselIMONumber = transportCall.vesselIMONumber;
        timestamp.UNLocationCode = transportCall.UNLocationCode;
        timestamp.carrierVoyageNumber = transportCall.carrierVoyageNumber;
        timestamp.carrierServiceCode = transportCall.carrierServiceCode;
        timestamp.facilitySMDGCode = transportCall.facilityCode;
      }
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
      case PortcallTimestampType.ATS_Pilot:
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

  getPortcallTimestampTypes(publisherRole: PublisherRole): string[] {
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
          PortcallTimestampType.ATS_Pilot,
        ]
      default:
        return [];
    }
  }


}



