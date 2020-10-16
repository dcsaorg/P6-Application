import {Component, Input, OnInit} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {SelectItem} from "primeng/api";

@Component({
  selector: 'app-timestamp-comment-dialog',
  templateUrl: './timestamp-comment-dialog.component.html',
  styleUrls: ['./timestamp-comment-dialog.component.scss']
})
export class TimestampCommentDialogComponent implements OnInit {

  public timestamp: PortcallTimestamp
  delayCodeOptions: SelectItem[] = [];

  constructor(public config: DynamicDialogConfig) {
  }

  ngOnInit(): void {
    this.timestamp = this.config.data.timestamp;
    this.delayCodeOptions.push({label: 'Select delay code', value: null});
    this.config.data.delayCode.forEach(delayCode => {
      this.delayCodeOptions.push({label: delayCode.smdgCode, value: delayCode})
    });
  }

}