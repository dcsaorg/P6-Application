import {CodeType} from "../base/codeType";
import {PartyFunction} from "./partyFunction";

export interface Config {
  company: string;
  publisherRole: PartyFunction;
  publisher: string;
  publisherCodeType: CodeType;

}
