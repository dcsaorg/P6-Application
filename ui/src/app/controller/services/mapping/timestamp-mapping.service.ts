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

@Injectable({
  providedIn: 'root'
})
export class TimestampMappingService {

  constructor(private scheduleService: ScheduleService, private transportCallService: TransportCallService,
              private transportEventService: TransportEventService, private globals: Globals) {
  }


  getPortCallTimestamps(): Observable<PortcallTimestamp[]> {

    return this.transportEventService.getTransportEvents().pipe(map(events => {
        const timestamps = this.mappingTransportEventsToTimestamps(events);
        this.loadTransportCalls(timestamps)
        return timestamps;
      }
    ))

    /*this.transportEventService.getTransportEvents().subscribe(
      transportEvent => {this.mappingTransportCallsToTimestamps(transportEvent)},
      error => {console.log("Oppsi: "+error.message)});
*/

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

  //This function iterates over a list of transportevnts
  private mappingTransportEventsToTimestamps(events: TransportEvent[]) {
    let timestamps: PortcallTimestamp[] = new Array();
    for (let event of events) {
      timestamps.push(this.mapTtansportEventToTimestamp(event));

    }
    return timestamps;
  }


  //This function maps a single transportEvent to a base timestamp
  private mapTtansportEventToTimestamp(event: TransportEvent): PortcallTimestamp {
    let timestamp: PortcallTimestamp;
    timestamp = new class implements PortcallTimestamp {
      callSequence: number;
      changeComment: string;
      classifierCode: string;
      delayCode: DelayCode | number;
      direction: string;
      eventTimestamp: string | Date;
      eventTypeCode: string;
      id: string;
      locationId: string;
      logOfTimestamp: string | Date;
      messageDirection: MessageDirection;
      messagingDetails: string;
      messagingStatus: string;
      modifiable: boolean;
      outdatedMessage: boolean;
      portNext: Port | number;
      portOfCall: Port | number;
      portPrevious: Port | number;
      response: PortcallTimestampType;
      sequenceColor: string;
      terminal: Terminal | number;
      timestampType: PortcallTimestampType | string;
      transportCallID: string;
      uiReadByUser: boolean;
      vessel: number | Vessel;
    };

    timestamp.id = event.eventID;
    timestamp.timestampType = "TBN";
    timestamp.classifierCode = event.eventClassifierCode;
    timestamp.eventTimestamp = event.eventTypeCode;
    timestamp.callSequence = 0;
    timestamp.logOfTimestamp = event.creationDateTime;
    timestamp.eventTimestamp = event.eventDateTime;
    timestamp.changeComment = event.comment;
    timestamp.transportCallID = event.transportCallID;
    timestamp.locationId = event.locationID;
    timestamp.uiReadByUser = true;


    // Addind dummy Values
    timestamp.portOfCall = 0;


    return timestamp;


  }


}



