import { vesselOperatorCarrierCodeListProvider } from "../enums/vesselOperatorCarrierCodeListProvider";
import {DimensionUnit} from "../enums/dimensionUnit";
import {VesselType} from "../enums/vesselType";

export interface Vessel {
  id?: string;                         // id
  vesselName?: string;                 // name: string; (35)
  vesselFlag?: string;                 // (2)
  vesselCallSignNumber?: string;       // (10)
  vesselOperatorCarrierCode?: string,
  vesselOperatorCarrierCodeListProvider?: vesselOperatorCarrierCodeListProvider,
  dimensionUnit?: DimensionUnit | null;
  type?: VesselType | null;
  width?: number;
  length?: number;

  vesselDraft?: number;

  vesselIMONumber: string;            // number; (7)

  /**
 * @deprecated
 */
  vesselOperatorCarrierID?: string;    // UUID

}

export interface TimestampVessel {
  vesselIMONumber: string;
  name: string | null;
  lengthOverall: number | null;
  width: number | null;
  callSign: string | null;
  type: VesselType | null;
  draft: number | null;
  dimensionUnit: DimensionUnit | null;
}
