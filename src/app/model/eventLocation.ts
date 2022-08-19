import { Address } from "./address";

export interface EventLocation {
    locationName?: string;
    latitude?: string;
    longitude?: string;
    UNLocationCode?: string;
    address?: Address;
    facilityCode?:string;
    facilityCodeListProvider?: string;
  }
