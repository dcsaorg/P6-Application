import {Component, OnInit} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {InstructionsComponent} from "../instructions/instructions.component";
import {ConfigService} from "../../controller/config.service";

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
              private configService: ConfigService) {
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
      width: '65%'})
  }

  showDownloladRequest() {
    this.displayDownloadRequest = true;
  }
}
