import {Injectable} from '@angular/core';
import {ScheduleService} from "../OVS/schedule.service";
import {TransportCallService} from "../OVS/transport-call.service";
import {OperationsEventService} from "../OVS/operations-event.service";
import {from, Observable} from "rxjs";
import {PortcallTimestamp} from "../../../model/base/portcall-timestamp";
import {TransportCall} from "../../../model/OVS/transport-call";
import {Port} from "../../../model/base/port";
import {map} from "rxjs/internal/operators";
import {Globals} from "../../../model/base/globals";
import {OperationsEventsToTimestampsPipe} from "../../pipes/operations-events-to-timestamps.pipe";
import {TimestampsToOperationsEventsPipe} from "../../pipes/timestamps-to-operations-events.pipe";
import {Terminal} from "../../../model/base/terminal";
import {OperationsEventToTimestampPipe} from "../../pipes/operations-event-to-timestamp.pipe";
import {FacilityCodeType} from "../../../model/OVS/facilityCodeType";

@Injectable({
  providedIn: 'root'
})
export class TimestampMappingService {

  constructor(private scheduleService: ScheduleService, private transportCallService: TransportCallService,
              private transportEventService: OperationsEventService,
              private globals: Globals,
              private transportEventsToTimestampsPipe: OperationsEventsToTimestampsPipe,
              private transportEventToTimestampPipe: OperationsEventToTimestampPipe,
              private timestampToTransportEventPipe: TimestampsToOperationsEventsPipe,


  ) {

  }


  addPortCallTimestamp(portCallTimestamp: PortcallTimestamp): Observable<PortcallTimestamp> {
    return this.transportEventService.addTransportEvent(this.timestampToTransportEventPipe.transform(portCallTimestamp, this.globals.config)).pipe(
      map(event => {return this.transportEventToTimestampPipe.transform(event)})
    )


  }

  getPortCallTimestamps(): Observable<PortcallTimestamp[]> {

    return this.transportEventService.getTransportEvents().pipe(map(events => {
        const timestamps = this.transportEventsToTimestampsPipe.transform(events);
        this.loadTransportCalls(timestamps)
        return timestamps;
      }
    ));
  }

  getPortCallTimestampsByTransportCall(transportCall: TransportCall): Observable<PortcallTimestamp[]> {
    return this.transportEventService.getTransportEventsByTransportCall(transportCall.transportCallID).pipe(map(events => {
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
    if (facilityCode.length > 5) {
      const smdgCode = facilityCode.substring(5, facilityCode.length);
      for (let terminal of this.globals.terminals) {
        if (terminal.smdgCode == smdgCode) {
          return terminal
        }
      }
    }
    return null;
  }


  private loadTransportCalls(timestamps: PortcallTimestamp[]) {
    // get TransportCallIds to be loaded
    const transportCallIDs: string[] = Array.from([...new Set(timestamps.map(timestamp => timestamp.transportCallID))]);
    this.callTransportCalls(transportCallIDs, timestamps)
  }

  private callTransportCalls(transportCallIDs: string[], timestamps: PortcallTimestamp[]): Observable<TransportCall[]> {
    // load all required transportCalls
    from(transportCallIDs).subscribe(transportCallID => {
      this.transportCallService.getTransportCallsById(transportCallID).subscribe(transportCall => this.mapTransportCallToTimestamps(timestamps, transportCall));
    });
    return null;
  }

  private mapTransportCallToTimestamps(timestamps: PortcallTimestamp[], transportCall: TransportCall) {

    for (let timestamp of timestamps) {
      if (timestamp.transportCallID == transportCall.transportCallID) {
        timestamp.portOfCall = this.getPortByUnLocode(transportCall.UNLocationCode).id;
        timestamp.vessel = parseInt(transportCall.vesselIMONumber);
        // Check if facility is a terminal
        if (transportCall.facilityTypeCode == FacilityCodeType.POTE) {
          timestamp.terminal = this.getTerminalByFacilityCode(transportCall.facilityCode)
        }
      }
    }
  }


}



