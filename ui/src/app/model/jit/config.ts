import { PublisherRole } from "../enums/publisherRole";
import { identifyingCodes } from "../portCall/identifyingCodes";
import { Publisher } from "../publisher";

export interface Config {
  enableJIT11Timestamps: Boolean;
  company: string;
  publisherRoles: PublisherRole[];
  publisher: Publisher;
  identifyingCodes: identifyingCodes;
  uiSupportBackendURL: string;
  jitBackendURL: string;
  dateTimeFormat: string;
  cognitoUserPoolId: string;
  cognitoAppClientId: string;
  enableVesselPositions: boolean
  authRegion: string;
  authUserPoolId: string;
  authUserPoolWebClientId: string;
  authMandatorySignIn: boolean;
  authRedirectUriSignIn: string;

}
