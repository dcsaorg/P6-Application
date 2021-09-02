import { PublisherRole } from "../enums/publisherRole";
import {CodeType} from "../portCall/codeType";
import { Publisher } from "../publisher";
import {PartyFunction} from "./partyFunction";

export interface Config {
  company: string;
  publisherRole: PublisherRole;
  publisher: Publisher;

}
