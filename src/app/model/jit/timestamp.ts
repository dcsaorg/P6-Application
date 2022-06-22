import { Publisher } from "../publisher";
import { PublisherRole } from "../enums/publisherRole";
import { FacilityTypeCode } from "../enums/facilityTypeCodeOPR";
import { OperationsEventTypeCode } from "../enums/operationsEventTypeCode";
import { EventLocation } from "../eventLocation";
import { VesselPosition } from "../vesselPosition";
import { ModeOfTransport } from "../enums/modeOfTransport";
import { PortCallServiceTypeCode } from "../enums/portCallServiceTypeCode";
import {Port} from "../../model/portCall/port";
import { EventClassifierCode } from "./eventClassifierCode";
import {NegotiationCycle} from "../portCall/negotiation-cycle";
import {TimestampDefinition} from "./timestamp-definition";
import {PortCallPhaseTypeCode} from "../enums/portCallPhaseTypeCode";

export interface Timestamp {
    publisher: Publisher;
    publisherRole: PublisherRole;
    vesselIMONumber: string;
    UNLocationCode: string;
        /**
   * @deprecated
   */
    facilitySMDGCode?: string;
    facilityTypeCode: FacilityTypeCode;
    eventClassifierCode: EventClassifierCode;
    operationsEventTypeCode: OperationsEventTypeCode;
    eventLocation?: EventLocation;
    vesselPosition?: VesselPosition;
    modeOfTransport?: ModeOfTransport;
    portCallPhaseTypeCode?: PortCallPhaseTypeCode;
    portCallServiceTypeCode?: PortCallServiceTypeCode;
    eventDateTime: Date | string;
    carrierServiceCode?: string;
    importVoyageNumber?: string;
    exportVoyageNumber?: string;
    portCallSequence?: string;
    remark?: string;
    delayReasonCode?: string;
    eventDeliveryStatus?: string;
    isLatestInCycle?: boolean;
    negotiationCycle?: NegotiationCycle;
    timestampDefinition?: TimestampDefinition;
    response?: TimestampDefinition;
    logOfTimestamp?: string | Date;

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
   uiReadByUser?:boolean;
     /**
   * @deprecated
   */
   sequenceColor?: string;

        /**
   * @deprecated
   */
    eventTimestamp?: string | Date;





  }
