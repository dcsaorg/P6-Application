import {Injectable} from '@angular/core';
import {PortcallTimestamp} from "./model/portcall-timestamp";
import {PortcallTimestampType} from "./model/portcall-timestamp-type.enum";

@Injectable({
  providedIn: 'root'
})
export class PortcallTimestampService {

  constructor() {
  }

  getPortcallTimestamps = (): PortcallTimestamp[] => {
    return [
      {
        timestampType: PortcallTimestampType.ETA_B,
        classifierCode: "EST",
        eventTypeCode: "ARRI",
        logOfCall: "2020-10-10T18:29:43",
        eventTimestamp: "2020-10-10T18:30:21",
        portFrom: "ESLAG",
        portTo: "DEHAM",
        nextPort: "NLRTM",
        direction: "N",
        terminalId: "CTA",
        locationId: "CTA 5-12",
      },
      {
        timestampType: PortcallTimestampType.RTA_B,
        classifierCode: "REQ",
        eventTypeCode: "ARRI",
        logOfCall: "2020-10-11T09:45:43",
        eventTimestamp: "2020-10-11T09:50:21",
        portFrom: "ESLAG",
        portTo: "DEHAM",
        nextPort: "NLRTM",
        direction: "N",
        terminalId: "CTA",
        locationId: "CTA 5-12",
      },
      {
        timestampType: PortcallTimestampType.PTA_B,
        classifierCode: "PLA",
        eventTypeCode: "ARRI",
        logOfCall: "2020-10-12T14:59:43",
        eventTimestamp: "2020-10-12T15:01:21",
        portFrom: "ESLAG",
        portTo: "DEHAM",
        nextPort: "NLRTM",
        direction: "N",
        terminalId: "CTA",
        locationId: "CTA 5-12",
      }
    ];
  }

}
