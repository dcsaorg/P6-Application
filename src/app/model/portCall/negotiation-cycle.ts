export interface NegotiationCycle {
  cycleName: string; // E.g., "Arrival at Berth" or "Start Cargo OPS"
  cycleKey: string; // E.g.,  "TA-Berth" or "TS-Cargo OPS"
  displayOrder: bigint; // Number to order them after how "important" the cycle is.
}
