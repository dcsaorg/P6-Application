import {Component, OnInit} from '@angular/core';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../../model/portCall/globals";
import {Timestamp} from "../../model/jit/timestamp";
import {Publisher} from "../../model/publisher";
import {PublisherRole} from "../../model/enums/publisherRole";
import {TimestampDefinitionTO} from "../../model/jit/timestamp-definition";

export interface JsonPublisher {
  publisher: Publisher;
  publisherRole: PublisherRole;
}

export interface PublisherExampleData {
  title: string;
  json: JsonPublisher;
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
