import { Address } from "../model/address";
import { identifyingCodes } from "./portCall/identifyingCodes";

export interface Publisher {
    partyName?: string; 
    taxReference1?: string;
    taxReference2?: string;
    publicKey?: string;
    address?: Address;
    nmftaCode?: string;
    identifyingCodes?: identifyingCodes; 
  
  }
  