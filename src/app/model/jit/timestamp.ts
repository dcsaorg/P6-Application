import { Publisher } from "../publisher";
import { PublisherRole } from "../enums/publisherRole";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";
import { OperationsEventTypeCode } from "../enums/operationsEventTypeCode";
import { EventLocation } from "../eventLocation";
import { VesselPosition } from "../vesselPosition";
import { ModeOfTransport } from "../enums/modeOfTransport";
import { PortCallServiceTypeCode } from "../enums/portCallServiceTypeCode";
import { Port } from "../../model/portCall/port";
import { EventClassifierCode } from "./eventClassifierCode";
import { NegotiationCycle } from "../portCall/negotiation-cycle";
import { timestampDefinitionTO } from "./timestamp-definition";
import { PortCallPhaseTypeCode } from "../enums/portCallPhaseTypeCode";
import { Vessel } from "../portCall/vessel";

export interface Timestamp {
  transportCallReference: string;
  publisher: Publisher;
  publisherRole: PublisherRole;
  UNLocationCode: string;
  facilityTypeCode: FacilityTypeCode;
  eventClassifierCode: EventClassifierCode;
  operationsEventTypeCode: OperationsEventTypeCode;
  eventLocation?: EventLocation;
  vesselPosition?: VesselPosition;
  portCallPhaseTypeCode?: PortCallPhaseTypeCode;
  portCallServiceTypeCode?: PortCallServiceTypeCode;
  eventDateTime: Date | string;
  carrierServiceCode?: string;
  portCallSequence?: string;
  remark?: string;
  delayReasonCode?: string;
  eventDeliveryStatus?: string;
  isLatestInCycle?: boolean;
  negotiationCycle?: NegotiationCycle;
  timestampDefinitionTO?: timestampDefinitionTO;
  response?: timestampDefinitionTO;
  logOfTimestamp?: string | Date;
  carrierExportVoyageNumber?: string;
  carrierImportVoyageNumber?: string;
  vessel?:  number | Vessel;
  portVisitReference?: string;
  milesToDestinationPort?: number;
  transportCallSequenceNumber?: number;

  /**
* @deprecated
*/
  modeOfTransport?: ModeOfTransport;
  /**
  * @deprecated
  */
  carrierVoyageNumber: string;

  /**
* @deprecated
*/
  importVoyageNumber?: string;
  /**
* @deprecated
*/
  exportVoyageNumber?: string;

  /**
* @deprecated
*/
  vesselIMONumber: string;
  /**
* @deprecated
*/
  facilitySMDGCode?: string;

  /**
 * @deprecated
 */
  facilityCode?: string;
  /**
   * @deprecated
   */
  portPrevious?: Port | number;
  /**
* @deprecated
*/
  portOfCall?: Port;
  /**
* @deprecated
*/
  portNext?: Port | number;
  /**
   * @deprecated
   */
  locationType?: Port | number;
  /**
   * @deprecated
   */
  modifable?: Port | number;
  /**
 * @deprecated
 */
  modifiable?: boolean;
  /**
* @deprecated
*/
  transportCallID?: string;
  /**
 * @deprecated
 */
  messagingStatus?: string;
  /**
 * @deprecated
 */
  messagingDetails?: string;
  /**
 * @deprecated
 */
  outdatedMessage?: boolean;
  /**
* @deprecated
*/
  uiReadByUser?: boolean;
  /**
* @deprecated
*/
  sequenceColor?: string;

  /**
* @deprecated
*/
  eventTimestamp?: string | Date;





}
