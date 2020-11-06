import {Component, OnInit} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {InstructionsComponent} from "../instructions/instructions.component";
import {ConfigService} from "../../controller/config.service";
import {DownloadService} from "../../controller/download.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DialogService]
})
export class HeaderComponent implements OnInit {

  companyName: string;
  displayDownloadRequest: boolean;

  constructor(private dialogService: DialogService,
              private configService: ConfigService,
              private downloadService: DownloadService,
              private messageService: MessageService) {
    configService.getConfig().subscribe(config => {
      this.companyName = config.companyName;
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
      summary: 'Error on requesting the timestamps in an CSV file.',
      detail: error.message
    });
  }
}
