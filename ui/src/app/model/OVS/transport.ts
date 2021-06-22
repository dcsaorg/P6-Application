import {TransportCallWank} from "./transport-call";
import {Vessel} from "../portCall/vessel";

export interface Transport {
  vessel: Vessel;
  dischargeTransportCall: TransportCallWank;
  loadTransportCall: TransportCallWank;
  modeOfTransport: string;
  transportReference: string;
}
