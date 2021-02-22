import { Injectable } from '@angular/core';
import {ScheduleService} from "../OVS/schedule.service";
import {TransportCallService} from "../OVS/transport-call.service";
import {TransportEventService} from "../OVS/transport-event.service";
import {Observable} from "rxjs";
import {PortcallTimestamp} from "../../../model/base/portcall-timestamp";
import {TransportEvent} from "../../../model/OVS/transport-event";
import {TransportCall} from "../../../model/OVS/transport-call";
import {PortcallTimestampType} from "../../../model/base/portcall-timestamp-type.enum";
import {DelayCode} from "../../../model/base/delayCode";
import {MessageDirection} from "../../../model/base/messageDirection";
import {Port} from "../../../model/base/port";
import {Terminal} from "../../../model/base/terminal";
import {Vessel} from "../../../model/base/vessel";

@Injectable({
  providedIn: 'root'
})
export class TimestampMappingService {

  constructor(private scheduleService: ScheduleService, private transportCallService: TransportCallService,
  private transportEventService: TransportEventService) {}


  getPortCallTimestamps(): Observable<PortcallTimestamp[]> {
    this.transportEventService.getTransportEvents().subscribe(
      transportEvent => {this.mappingTransportCallsToTimestamps(transportEvent)},
      error => {console.log("Oppsi: "+error.message)});

    return ;
  }

  //This function iterates over a list of transportevnts
  private mappingTransportCallsToTimestamps(events: TransportEvent[]){
    let timestamps: PortcallTimestamp[] = new Array();
    for(let event of events){
      timestamps.push(this.mapTtansportEventToTimestamp(event));
    }

    console.log(timestamps);
  }


  //This function maps a single transportEvent to a base timestamp
  private mapTtansportEventToTimestamp(event: TransportEvent):PortcallTimestamp{
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
    }
    ;

    timestamp.id = event.eventID;
    timestamp.timestampType = "TBN";
    timestamp.classifierCode = event.eventClassifierCode;
    timestamp.eventTimestamp = event.eventTypeCode;
    timestamp.callSequence = 0;
    timestamp.logOfTimestamp = event.creationDateTime;
    timestamp.eventTimestamp = event.eventDateTime;
    timestamp.changeComment = event.comment;
    timestamp.transportCallID = event.transportCallID;


    return timestamp;


  }





}



