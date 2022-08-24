import { vesselOperatorCarrierCodeListProvider } from "../enums/vesselOperatorCarrierCodeListProvider";

export interface Vessel {
  id?: string;                         // id
  vesselName?: string;                 // name: string; (35)
  vesselFlag?: string;                 // (2)
  vesselCallSignNumber?: string;       // (10)
  vesselOperatorCarrierCode?: string,
  vesselOperatorCarrierCodeListProvider?: vesselOperatorCarrierCodeListProvider,
  dimensionUnit?: string;
  type?: string;
  width?: number;
  length?: number;

  vesselDraft?: number;

  vesselIMONumber: string;            // number; (7)
  
  /**
 * @deprecated
 */
  vesselOperatorCarrierID?: string;    // UUID

}
