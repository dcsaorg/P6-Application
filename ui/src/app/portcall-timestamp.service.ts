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
        communicationTimestamp: "20201010T182943",
        eventTimestamp: "20201010T183021",
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
