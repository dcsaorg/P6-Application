import { PublisherRole } from "../enums/publisherRole";
import { identifyingCodes } from "../portCall/identifyingCodes";
import { Publisher } from "../publisher";

export interface Config {
  company: string;
  publisherRole: PublisherRole;
  publisher: Publisher;
  identifyingCodes: identifyingCodes;
  uiSupportBackendURL: string;
  ovsBackendURL: string;
  dateTimeFormat: string;
  cognitoUserPoolId: string;
  cognitoAppClientId: string;
  enableVesselPositions: boolean
}
