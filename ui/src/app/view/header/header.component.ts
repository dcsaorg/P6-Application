import {Component, OnInit} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {InstructionsComponent} from "../instructions/instructions.component";
import {ConfigService} from "../../controller/services/config.service";
import {DownloadService} from "../../controller/services/download.service";
import {MessageService, SelectItem} from "primeng/api";
import {RoleType} from "../../model/roleType";
import {CodeType} from "../../model/codeType";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DialogService]
})
export class HeaderComponent implements OnInit {

  companyName: string;
  companyRole: RoleType;
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
              private translate: TranslateService) {
    configService.getConfig().subscribe(config => {
      this.companyName = config.company;
      this.companyRole = config.senderRole;
      this.companyCodeType = config.senderIdType;
      this.companyId = config.senderId;
    });
  }

  ngOnInit(): void {
  }

  showInstructions() {
    console.log("Instructions!")
    this.dialogService.open(InstructionsComponent, {
      header: 'Instructions',
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

}
