import {Component, OnInit} from '@angular/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../../model/portCall/globals";
import {Timestamp} from "../../model/jit/timestamp";
import {Publisher} from "../../model/publisher";
import {PublisherRole} from "../../model/enums/publisherRole";
import {TimestampDefinitionTO} from "../../model/jit/timestamp-definition";
import {EventClassifierCode} from "../../model/jit/event-classifier-code";
import {OperationsEventTypeCode} from "../../model/enums/operationsEventTypeCode";
import {FacilityTypeCode} from "../../model/enums/facilityTypeCodeOPR";
import {PortCallPhaseTypeCode} from "../../model/enums/portCallPhaseTypeCode";
import {PortCallServiceTypeCode} from "../../model/enums/portCallServiceTypeCode";
import {EventLocation} from "../../model/eventLocation";
import {TimestampVessel} from "../../model/portCall/vessel";
import {VesselPosition} from "../../model/vesselPosition";

export interface TimestampPublisherInfo {
  publisher: Publisher;
  publisherRole: PublisherRole;
}

export interface TimestampClassifierInfo {
  eventClassifierCode: EventClassifierCode;
  operationsEventTypeCode: OperationsEventTypeCode;
  facilityTypeCode: FacilityTypeCode;
  portCallPhaseTypeCode: PortCallPhaseTypeCode;
  portCallServiceTypeCode: PortCallServiceTypeCode;
}

export interface EventLocationInfo {
  eventLocation: EventLocation;
  UNLocationCode: string;
  facilitySMDGCode: string;
}

export interface PortCallInfo {
  carrierServiceCode: string;
  carrierExportVoyageNumber: string;
  carrierImportVoyageNumber: string;
  carrierVoyageNumber: string;
  transportCallSequenceNumber: number;
  portVisitReference: string | null;
}

export interface VesselInfo {
  vessel: TimestampVessel;
  vesselIMONumber: string;
  vesselPosition: VesselPosition;
  milesToDestinationPort: number | null;
}

export interface EventInfo {
  eventClassifierCode: EventClassifierCode;
  operationsEventTypeCode: OperationsEventTypeCode;
  facilityTypeCode: FacilityTypeCode;
  portCallPhaseTypeCode: PortCallPhaseTypeCode;
  portCallServiceTypeCode: PortCallServiceTypeCode;
  eventDateTime: Date | string;
  remark: string | null;
  delayReasonCode: string | null;
}


interface PublisherExampleData {
  title: string;
  json: TimestampPublisherInfo;
}

interface JSONGroup {
  title: string;
  description: string;
  payload: object;
}

@Component({
  selector: 'app-show-json-dialog',
  templateUrl: './show-timestamp-as-json-dialog.component.html',
  styleUrls: ['./show-timestamp-as-json-dialog.component.scss'],
  providers: [
    DialogService,
  ]
})
export class ShowTimestampAsJsonDialogComponent implements OnInit {
  payload: Timestamp;
  timestampDefinition: TimestampDefinitionTO;
  matchingPublishers: PublisherExampleData[] = []
  timestampGroups: JSONGroup[] = [];

  constructor(
    private globals: Globals,
    public config: DynamicDialogConfig,
    private translate: TranslateService,
    public ref: DynamicDialogRef,
    ) {
  }

  ngOnInit(): void {
    this.payload = this.config.data.payload;
    this.timestampDefinition = this.config.data.timestampDefinition;
    this.matchingPublishers = this.loadExamplePublishers()
      .filter(er => this.timestampDefinition?.publisherPattern?.some(pp => pp.publisherRole == er.json.publisherRole));
    this.timestampGroups = [
      {
        title: "Publisher & role",
        description: "Who sent this timestamp?  (Please see Example publishers for better examples)",
        payload: this.asPublisherInfo(this.payload)
      },
      {
        title: "Event Info",
        description: "The basic part of the event (when/what).",
        payload: this.asEventInfo(this.payload)
      },
      {
        title: "Timestamp classification (subset of Event Info)",
        description: "The exact subset of Event Info that defines the concrete type of timestamp (e.g., ETA-Berth vs. ESOP).",
        payload: this.asClassifierInfo(this.payload)
      },
      {
        title: "Event location description",
        description: "Where this happens - May include a terminal (facilityCode/facilitySMDGCode) or a berth/PBP location (locationName)",
        payload: this.asEventLocationInfo(this.payload)
      },
      {
        title: "Vessel information",
        description: "Information related to the vessel (and optionally its position/distance to the destination)",
        payload: this.asVesselInfo(this.payload)
      },
      {
        title: "Port Call information",
        description: "Information relating to the carrier voyage",
        payload: this.asPortCallInfo(this.payload)
      }
    ]
  }


  private asPublisherInfo(timestamp: Timestamp): TimestampPublisherInfo {
    return {
      publisher: timestamp.publisher,
      publisherRole: timestamp.publisherRole,
    }
  }

  private asClassifierInfo(timestamp: Timestamp): TimestampClassifierInfo {
    return {
      eventClassifierCode: timestamp.eventClassifierCode,
      operationsEventTypeCode: timestamp.operationsEventTypeCode,
      facilityTypeCode: timestamp.facilityTypeCode,
      portCallPhaseTypeCode: timestamp.portCallPhaseTypeCode,
      portCallServiceTypeCode: timestamp.portCallServiceTypeCode,
    }
  }

  private asEventLocationInfo(timestamp: Timestamp): EventLocationInfo {
    return {
      eventLocation: timestamp.eventLocation,
      UNLocationCode: timestamp.UNLocationCode,
      facilitySMDGCode: timestamp.facilitySMDGCode,
    }
  }

  private asPortCallInfo(timestamp: Timestamp): PortCallInfo {
    return {
      carrierExportVoyageNumber: timestamp.carrierExportVoyageNumber,
      carrierImportVoyageNumber: timestamp.carrierImportVoyageNumber,
      carrierVoyageNumber: timestamp.carrierVoyageNumber,
      carrierServiceCode: timestamp.carrierServiceCode,
      portVisitReference: timestamp.portVisitReference,
      transportCallSequenceNumber: timestamp.transportCallSequenceNumber,
    }
  }

  private asVesselInfo(timestamp: Timestamp): VesselInfo {
    return {
      vessel: timestamp.vessel,
      vesselIMONumber: timestamp.vesselIMONumber,
      vesselPosition: timestamp.vesselPosition,
      milesToDestinationPort: timestamp.milesToDestinationPort,
    }
  }

  private asEventInfo(timestamp: Timestamp): EventInfo {
    return {
      eventClassifierCode: timestamp.eventClassifierCode,
      operationsEventTypeCode: timestamp.operationsEventTypeCode,
      facilityTypeCode: timestamp.facilityTypeCode,
      portCallPhaseTypeCode: timestamp.portCallPhaseTypeCode,
      portCallServiceTypeCode: timestamp.portCallServiceTypeCode,

      eventDateTime: timestamp.eventDateTime,
      // eventCreatedDateTime goes here when we added to the API.
      remark: timestamp.remark,
      delayReasonCode: timestamp.delayReasonCode,
    }
  }


  close() {
    this.ref.close(null);
  }


  private loadExamplePublishers(): PublisherExampleData[] {
    return [
      {
        title: "Carrier (Evergreen Marine)",
        json: {
          publisherRole: PublisherRole.CA,
          publisher: {
            partyName: "Evergreen Vessel Operations",
            identifyingCodes: [
              {
                DCSAResponsibleAgencyCode: "SMDG",
                codeListResponsibleAgencyCode: "306",
                partyCode: "EMC",
                codeListName: "LCL",
              }
            ]
          }
        }
      },
      {
        title: "Terminal (Hamburg / Eurogate terminal)",
        json: {
          publisherRole: PublisherRole.TR,
          publisher: {
            partyName: "Hamburg Eurogate terminal operations",
            identifyingCodes: [
              {
                DCSAResponsibleAgencyCode: "SMDG",
                codeListResponsibleAgencyCode: "306",
                partyCode: "EGH",
                codeListName: "TCL",
              },
              {
                DCSAResponsibleAgencyCode: "UNECE",
                codeListResponsibleAgencyCode: "6",
                partyCode: "DEHAM"
              }
            ]
          }
        }
      },
      {
        title: "Port Authority (Hamburg)",
        json: {
          publisherRole: PublisherRole.ATH,
          publisher: {
            partyName: "Hamburg Port Authority",
            identifyingCodes: [
              {
                DCSAResponsibleAgencyCode: "UNECE",
                codeListResponsibleAgencyCode: "6",
                partyCode: "DEHAM"
              }
            ]
          }
        }
      }
    ]
  }
}
