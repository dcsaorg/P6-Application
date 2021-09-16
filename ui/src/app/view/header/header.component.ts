import {Component, OnInit} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {InstructionsComponent} from "../instructions/instructions.component";
import {ConfigService} from "../../controller/services/base/config.service";
import {MenuItem, MessageService, SelectItem} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {Globals} from "../../model/portCall/globals";
import { PublisherRole } from 'src/app/model/enums/publisherRole';
import { AuthService } from 'src/app/auth/auth.service';
import {ExportService} from "../../controller/services/base/export.service";

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
  companyCodeType: PublisherRole;
  companyId: string;
  displayDownloadRequest: boolean;

  availableLanguages: SelectItem[] = [
    {label: "English", value: "en"},
    {label: "Deutsch", value: "de"}
  ];
  currentLanguage: SelectItem = this.availableLanguages[0];

  constructor(private dialogService: DialogService,
              private configService: ConfigService,
              private messageService: MessageService,
              private translate: TranslateService,
              private globals: Globals,
              private authService: AuthService,
              private exportService: ExportService,
              ) {
    this.companyName = globals.config.publisher.partyName;
    this.companyRole = globals.config.publisher.nmftaCode;
    this.companyId = globals.config.publisher.nmftaCode;
    this.companyCodeType = globals.config.publisherRole;
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
        label: this.translate.instant('Pending from Guido'),
        icon: 'pi pi-exclamation-circle',
        url: '/assets/termsofuse.pdf',
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

  
  onLogout(){
    this.authService.logUserOut();
  }

}
