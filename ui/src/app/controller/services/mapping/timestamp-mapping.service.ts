import {Injectable} from '@angular/core';
import {ScheduleService} from "../OVS/schedule.service";
import {TransportCallService} from "../OVS/transport-call.service";
import {TransportEventService} from "../OVS/transport-event.service";
import {from, Observable} from "rxjs";
import {PortcallTimestamp} from "../../../model/base/portcall-timestamp";
import {TransportEvent} from "../../../model/OVS/transport-event";
import {TransportCall} from "../../../model/OVS/transport-call";
import {PortcallTimestampType} from "../../../model/base/portcall-timestamp-type.enum";
import {DelayCode} from "../../../model/base/delayCode";
import {MessageDirection} from "../../../model/base/messageDirection";
import {Port} from "../../../model/base/port";
import {Terminal} from "../../../model/base/terminal";
import {Vessel} from "../../../model/base/vessel";
import {flatMap, map, timestamp} from "rxjs/internal/operators";
import {Globals} from "../../../view/globals";
import {TransportEventsToTimestampsPipe} from "../../pipes/transport-events-to-timestamps.pipe";
import {TimestampsToTransportEventsPipe} from "../../pipes/timestamps-to-transport-events.pipe";

@Injectable({
  providedIn: 'root'
})
export class TimestampMappingService {

  constructor(private scheduleService: ScheduleService, private transportCallService: TransportCallService,
              private transportEventService: TransportEventService, private globals: Globals,
              private transportEventsToTimestampsPipe: TransportEventsToTimestampsPipe,
              private timestampToTransportEventPipe: TimestampsToTransportEventsPipe) {

  }


  addPortCallTimestamp(portCallTimestamp: PortcallTimestamp):Observable<PortcallTimestamp>{
     let $resultEvent =  this.transportEventService.addTransportEvent(this.timestampToTransportEventPipe.transform(portCallTimestamp))
    return null;
  }

  getPortCallTimestamps(): Observable<PortcallTimestamp[]> {

    return this.transportEventService.getTransportEvents().pipe(map(events => {
        const timestamps = this.transportEventsToTimestampsPipe.transform(events);
        this.loadTransportCalls(timestamps)
        return timestamps;
      }
    ));
  }

  getPortCallTimestampsByTransportCall(transportCall: TransportCall): Observable<PortcallTimestamp[]>{
    return this.transportEventService.getTransportEventsByTransportCall(transportCall.transportCallID).pipe(map(events =>{
      const timestamps = this.transportEventsToTimestampsPipe.transform(events)
      this.mapTransportCallToTimestamps(timestamps, transportCall);
      return timestamps;
    }))
  }


  //@Todo refactor, as this might run into a race condition!
  getPortByUnLocode(unlocode: string): Port {
    //@todo check if list is available
    for (let port of this.globals.ports) {
      if (port.unLocode == unlocode) {
        return port;
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

      }
    }
  }



}



