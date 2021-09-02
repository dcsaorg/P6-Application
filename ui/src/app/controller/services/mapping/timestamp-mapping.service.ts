import {Injectable} from '@angular/core';
import {TransportCallService} from "../ovs/transport-call.service";
import {OperationsEventService} from "../ovs/operations-event.service";
import {from, Observable} from "rxjs";
import {TransportCall} from "../../../model/ovs/transport-call";
import {Port} from "../../../model/portCall/port";
import {map} from "rxjs/internal/operators";
import {Globals} from "../../../model/portCall/globals";
import {OperationsEventsToTimestampsPipe} from "../../pipes/operations-events-to-timestamps.pipe";
import {Terminal} from "../../../model/portCall/terminal";
import {Timestamp} from "../../../model/ovs/timestamp";
import {TimestampService} from "../ovs/timestamps.service";
import { TimestampToStandardizedtTimestampPipe } from '../../pipes/timestamp-to-standardized-timestamp';

@Injectable({
  providedIn: 'root'
})
export class TimestampMappingService {

  constructor(private transportCallService: TransportCallService,
              private operationsEventService: OperationsEventService,
              private globals: Globals,
              private transportEventsToTimestampsPipe: OperationsEventsToTimestampsPipe,
              private timestampToTransportEventPipe: TimestampToStandardizedtTimestampPipe,
              private timestampService: TimestampService

  ) {

  }


  addPortCallTimestamp(timestamp: Timestamp): Observable<Timestamp> {
    return this.timestampService.addTimestamp(this.timestampToTransportEventPipe.transform(timestamp, this.globals.config))
  }

  getPortCallTimestamps(): Observable<Timestamp[]> {

    return this.operationsEventService.getOperationsEvents().pipe(map(events => {
        const timestamps = this.transportEventsToTimestampsPipe.transform(events);
        this.loadTransportCalls(timestamps)
        return timestamps;
      }
    ));
  }

  getPortCallTimestampsByTransportCall(transportCall: TransportCall): Observable<Timestamp[]> {
    return this.operationsEventService.getOperationsEventsByTransportCall(transportCall.transportCallID).pipe(map(events => {
      const timestamps = this.transportEventsToTimestampsPipe.transform(events)
      this.mapTransportCallToTimestamps(timestamps, transportCall);
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
        timestamp.portOfCall =  this.getPortByUnLocode(transportCall.UNLocationCode);
        timestamp.vesselIMONumber = transportCall.vesselIMONumber;
        timestamp.UNLocationCode = transportCall.UNLocationCode;
        timestamp.carrierVoyageNumber = transportCall.carrierVoyageNumber;
        timestamp.carrierServiceCode = transportCall.carrierServiceCode;
      timestamp.facilitySMDGCode = transportCall.facilityCode;
      }
    }
  }


}



