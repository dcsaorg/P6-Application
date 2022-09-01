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
        title: "Publisher",
        description: "Who sent this timestamp?  (Please see Example publishers for better examples)",
        payload: this.asPublisherInfo(this.payload)
      },
      {
        title: "Timestamp classification",
        description: "Which fields are used to determine which business timestamp is this? (e.g., ETA-Berth vs. ESOP)",
        payload: this.asClassifierInfo(this.payload)
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
