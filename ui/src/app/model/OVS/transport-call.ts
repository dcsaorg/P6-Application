import {Schedule} from "./schedule";

export interface TransportCall {
  transportCallID: string;
  scheduleID: Schedule | string;
  carrierServiceCode: string;
  vesselIMONumber: string;
  vesselName: string;
  carrierVoyageNumber: string;
  UNLocationCode: string;
  UNLocationName: string;
  transportCallNumber: number;
  facilityTypeCode: string;
  facilityCode: string;
  otherFacility: string;

}
