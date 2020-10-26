import {Component, OnInit} from '@angular/core';
import {DialogService} from "primeng/dynamicdialog";
import {InstructionsComponent} from "../instructions/instructions.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [DialogService]
})
export class HeaderComponent implements OnInit {

  companyName: string = "Test"
  displayDownloadRequest: boolean;
  constructor(private dialogService: DialogService) {
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
