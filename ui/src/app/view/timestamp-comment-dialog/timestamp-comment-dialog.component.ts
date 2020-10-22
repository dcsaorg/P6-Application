import {Component, OnInit} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {SelectItem} from "primeng/api";

@Component({
  selector: 'app-timestamp-comment-dialog',
  templateUrl: './timestamp-comment-dialog.component.html',
  styleUrls: ['./timestamp-comment-dialog.component.scss']
})
export class TimestampCommentDialogComponent implements OnInit {

  public timestamp: PortcallTimestamp
  delayCodeOptions: SelectItem[] = [];
  readonly: boolean;

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef) {
  }

  ngOnInit(): void {
    this.timestamp = this.config.data.timestamp;
    this.readonly = this.config.data.readonly;
    if (this.readonly) {
      if (!this.config.data.timestamp.delayCode) {
        this.delayCodeOptions.push({label: 'No code selected', value: null});
      }
    } else {
      this.delayCodeOptions.push({label: 'Select delay code (optional)', value: null});
    }
    this.config.data.delayCode.forEach(delayCode => {
      this.delayCodeOptions.push({label: delayCode.smdgCode, value: delayCode})
    });
  }

  close() {
    this.ref.close(null);
  }
}
