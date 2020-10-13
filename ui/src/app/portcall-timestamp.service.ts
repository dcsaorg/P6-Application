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
        eventLocationCode: "Berth",
        communicationTimestamp: "2020-10-10T18:29:43",
        eventTimestamp: "2020-10-10T18:30:21",
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
