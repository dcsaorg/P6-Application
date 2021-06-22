import {TransportCall} from "./transport-call";
import {Vessel} from "../portCall/vessel";

export interface Transport {
  vessel: Vessel;
  dischargeTransportCall: TransportCall;
  loadTransportCall: TransportCall;
  modeOfTransport: string;
  transportReference: string;
}
