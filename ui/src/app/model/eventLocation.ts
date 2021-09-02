import { Address } from "../model/address";

export interface EventLocation {
    locationName?: string; 
    latitude?: string;
    longitude?: string;
    publicKey?: string;
    UNLocationCode?: string;
    address?: Address;
  }
  