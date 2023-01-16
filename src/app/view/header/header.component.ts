import { Component, OnInit } from '@angular/core';
import { DialogService } from "primeng/dynamicdialog";
import { InstructionsComponent } from "../instructions/instructions.component";
import { MenuItem, MessageService, SelectItem } from "primeng/api";
import { TranslateService } from "@ngx-translate/core";
import { Globals } from "../../model/portCall/globals";
import { ExportService } from "../../controller/services/base/export.service";
import {take} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DialogService]
})
export class HeaderComponent implements OnInit {

  helpMenu: MenuItem[];
  companyName: string;
  companyCodeType: string;
  displayDownloadRequest: boolean;
  authLocalState: boolean;
  downloadProgressing: boolean = false;

  availableLanguages: SelectItem[] = [
    { label: "English", value: "en" },
    { label: "Deutsch", value: "de" }
  ];
  currentLanguage: SelectItem = this.availableLanguages[0];

  constructor(private dialogService: DialogService,
    private messageService: MessageService,
    private translate: TranslateService,
    private globals: Globals,
    private exportService: ExportService,
  ) {
    this.companyName = globals.config.publisher.partyName;
    this.companyCodeType = globals.config.publisherRoles.length > 0 ? globals.config.publisherRoles.join(", ") : "Spectator";
  }

  ngOnInit(): void {
    this.helpMenu = [{
      label: this.translate.instant('Help'),
      items: [
        {
          label: this.translate.instant('Instructions'),
          icon: 'pi pi-question',
          command: () => {
            this.showInstructions();
          }
        },
        {
          label: this.translate.instant('Terms of Service'),
          icon: 'pi pi-exclamation-circle',
          url: '/assets/termsofservice.pdf',
        },
        {
          label: this.translate.instant('Download Timestamps'),
          icon: 'pi pi-download',
          command: () => {
            this.displayDownloadRequest = true;
          }
        }
      ]
    }
    ];
    this.authLocalState = this.globals.config.authentication;
  }

  showInstructions() {
    this.dialogService.open(InstructionsComponent, {
      header: this.translate.instant('general.instructions.label'),
      width: '65%'
    })
  }

  showDownloadRequest() {
    this.displayDownloadRequest = true;
  }


  downloadTimestamps() {
    this.downloadProgressing = true;
    this.exportService.getExportAsExcel().pipe(take(1)).subscribe({
      next: (data) => {
        this.downloadingTimestamps(data);
        this.messageService.add({
          key: 'DownloadRequestSuccess',
          severity: 'success',
          summary: 'Downloaded successfully',
          detail: ''
        });
        this.displayDownloadRequest = false;
        this.downloadProgressing = false;
      }, error: errorResponse => {
        this.messageService.add({
          key: 'DownloadRequestError',
          severity: 'error',
          summary: 'Error while downloading file.',
          detail: errorResponse.message
        })
        this.displayDownloadRequest = false;
        this.downloadProgressing = false;
      }
    })
  }

  downloadingTimestamps(data) {
    let file: Blob = new Blob([data], { type: 'xlsx' });
    const a = document.createElement('a')
    const objectUrl = URL.createObjectURL(file)
    a.href = objectUrl;
    a.download = "PortCall_Timestamps_Export.xlsx";
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  changeLanguage(selectedLanguage: SelectItem) {
    this.translate.use(selectedLanguage.value);
  }


}
