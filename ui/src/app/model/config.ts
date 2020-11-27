import {RoleType} from "./roleType";
import {CodeType} from "./codeType";

export interface Config {
  company: string;
  senderRole: RoleType;
  senderIdType: CodeType;
  senderId: string;

}
