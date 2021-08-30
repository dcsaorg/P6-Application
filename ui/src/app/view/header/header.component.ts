import {Component, OnInit} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {InstructionsComponent} from "../instructions/instructions.component";
import {ConfigService} from "../../controller/services/base/config.service";
import {DownloadService} from "../../controller/services/base/download.service";
import {MenuItem, MessageService, SelectItem} from "primeng/api";
import {CodeType} from "../../model/portCall/codeType";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {Globals} from "../../model/portCall/globals";
import { PublisherRole } from 'src/app/model/enums/publisherRole';
import { environment } from 'src/environments/environment';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DialogService]
})
export class HeaderComponent implements OnInit {

  helpMenu: MenuItem[];
  companyName: string;
  companyRole: PublisherRole;
  companyCodeType: CodeType;
  companyId: string;
  displayDownloadRequest: boolean;

  availableLanguages: SelectItem[] = [
    {label: "English", value: "en"},
    {label: "Deutsch", value: "de"}
  ];
  currentLanguage: SelectItem = this.availableLanguages[0];

  constructor(private dialogService: DialogService,
              private configService: ConfigService,
              private downloadService: DownloadService,
              private messageService: MessageService,
              private translate: TranslateService,
              private globals: Globals,
              private router: Router) {
    configService.getConfig().subscribe(config => {
      this.globals.config = config;
      this.companyName = config.company;
      this.companyRole = config.publisherRole;
      this.companyId = config.publisher.partyName;
   //   this.companyCodeType = config.publisherCodeType; // WHAT IS SUPPOSE TO REPRESENT 
    });
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
        command: () => {
        }
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
    console.log("Instructions!")
    this.dialogService.open(InstructionsComponent, {
      header: this.translate.instant('general.instructions.label'),
      width: '65%'
    })
  }

  showDownloadRequest() {
    this.displayDownloadRequest = true;
  }

  downloadTimeStamps() {
    console.log("Download clicked");
    this.downloadService.downloadTimestampsAsCsv().subscribe((data) => {
      let file: Blob = new Blob([data], {type: 'text/csv'});
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(file)
      a.href = objectUrl;
      a.download = "PortCall_Timestamps_Export.csv";
      a.click();
      URL.revokeObjectURL(objectUrl);
      this.displayDownloadRequest = false;
    }), error => this.messageService.add({
      key: 'DownloadRequestError',
      severity: 'error',
      summary: 'Error on requesting the $timestamps in an CSV file.',
      detail: error.message
    });
  }

  changeLanguage(selectedLanguage: SelectItem) {
    console.log(selectedLanguage);
    this.translate.use(selectedLanguage.value);
  }

  
  onLogout(): void {
    let poolData = {
      UserPoolId: environment.cognitoUserPoolId,
      ClientId: environment.cognitoAppClientId
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();
    cognitoUser?.signOut();
    this.router.navigate(["signin"])
  }


}
