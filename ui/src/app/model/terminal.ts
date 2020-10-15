import {Port} from "./port";

export interface Terminal {
  id: number;
  port: Port;
  smdgCode: string;
  terminalName: string;
  terminalOperator: string;
}
