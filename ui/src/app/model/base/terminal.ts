import {Port} from "./port";

export interface Terminal {
  id: number;
  port: number;
  smdgCode: string;
  terminalName: string;
  terminalOperator: string;
}
