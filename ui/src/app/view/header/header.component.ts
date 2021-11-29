import {Component, OnInit} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {InstructionsComponent} from "../instructions/instructions.component";
import {ConfigService} from "../../controller/services/base/config.service";
import {MenuItem, MessageService, SelectItem} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../../model/portCall/globals";
import { AuthService } from 'src/app/auth/auth.service';
import {ExportService} from "../../controller/services/base/export.service";
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DialogService]
})
export class HeaderComponent implements OnInit {

  helpMenu: MenuItem[];
  companyName: string;
  companyRole: string;
  companyCodeType: string;
  companyId: string;
  displayDownloadRequest: boolean;
  authLocalState: boolean;

  availableLanguages: SelectItem[] = [
    {label: "English", value: "en"},
    {label: "Deutsch", value: "de"}
  ];
  currentLanguage: SelectItem = this.availableLanguages[0];

  constructor(private dialogService: DialogService,
              private messageService: MessageService,
              private translate: TranslateService,
              private globals: Globals,
              private exportService: ExportService,
              ) {
    this.companyName = globals.config.publisher.partyName;
    this.companyRole = globals.config.publisher.nmftaCode;
    this.companyId = globals.config.publisher.nmftaCode;
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
            this.showDownloadRequest();
          }
        }
      ]}
    ];
    this.authLocalState = environment.authentication;
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


  downloadTimeStamps() {
    this.exportService.getExport().subscribe(data => {
      this.downloadingTimeStamps(data);
      this.messageService.add({
        key: 'DownloadRequestSuccess',
        severity: 'success',
        summary: 'Downloaded successfully',
        detail: ''
      });
    }, error =>
        this.messageService.add({
          key: 'DownloadRequestError',
          severity: 'error',
          summary: 'Error while downloading file.',
          detail: error.message
        })
    )
  }

  downloadingTimeStamps(data) {
//    const blob = new Blob([data], { type: '.xlsx' });
 //   const url = window.URL.createObjectURL(blob);
  //  window.open(url);
  let file: Blob = new Blob([data], {type: 'xlsx'});
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
