import {vesselOperatorCarrierCodeListProvider} from "../enums/vesselOperatorCarrierCodeListProvider";

export interface Vessel {
  vesselIMONumber: string;            // id: number; (7)
  vesselName: string;                 // name: string; (35)
  vesselFlag: string;                 // (2)
  vesselCallSignNumber: string;       // (10)
  vesselOperatorCarrierCode: string, 
  vesselOperatorCarrierCodeListProvider: vesselOperatorCarrierCodeListProvider, 

    /**
   * @deprecated
   */
  vesselOperatorCarrierID?: string;    // UUID
  /**
   * @deprecated
   */
  teu?: number;                        // Transient

  /**
   * @deprecated
   */
  serviceNameCode?: string;            // Transient

}
