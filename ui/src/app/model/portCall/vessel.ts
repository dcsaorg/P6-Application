export interface Vessel {
  vesselIMONumber: number;            // id: number; (7)
  vesselName: string;                 // name: string; (35)
  vesselFlag: string;                 // (2)
  vesselCallSignNumber: string;       // (10)
  vesselOperatorCarrierID: string;    // UUID

  /**
   * @deprecated
   */
  teu: number;                        // Transient

  /**
   * @deprecated
   */
  serviceNameCode: string;            // Transient

}
