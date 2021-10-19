export interface NegotiationCycle {
  name: string; // E.g., "Arrival at Berth" or "Start Cargo OPS"
  cycleKey: string; // E.g.,  "TA-Berth" or "TS-Cargo OPS"
  timestampTypes?: string[];
}
