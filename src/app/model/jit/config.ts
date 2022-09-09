import { PublisherRole } from "../enums/publisherRole";
import { IdentifyingCode } from "../portCall/identifyingCode";
import { Publisher } from "../publisher";

export interface Config {
  company: string;
  publisherRoles: PublisherRole[];
  publisher: Publisher;
  identifyingCodes: IdentifyingCode[];
  uiSupportBackendURL: string;
  jitBackendURL: string;
  dateTimeFormat: string;
  enableVesselPositions: boolean
  authRegion: string;
  authUserPoolId: string;
  authUserPoolWebClientId: string;
  authRedirectUriSignIn: string;
  enableShowTimestampsAsJSON: boolean | null;

}
