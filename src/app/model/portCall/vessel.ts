import { vesselOperatorCarrierCodeListProvider } from "../enums/vesselOperatorCarrierCodeListProvider";
import { DimensionUnit } from "../enums/dimensionUnit";
import { VesselType } from "../enums/vesselType";

export interface Vessel {
  vesselIMONumber: string;
  vesselName?: string;
  vesselFlag?: string;
  vesselCallSignNumber?: string;
  vesselOperatorCarrierCode?: string | null;
  vesselOperatorCarrierCodeListProvider?: vesselOperatorCarrierCodeListProvider | null;
  dimensionUnit?: DimensionUnit | null;
  type?: VesselType | null;
  width?: number;
  length?: number;
  vesselDraft?: number;
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
