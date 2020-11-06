import {Component, OnInit} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {SelectItem} from "primeng/api";
import {DelayCode} from "../../model/delayCode";

@Component({
  selector: 'app-timestamp-comment-dialog',
  templateUrl: './timestamp-comment-dialog.component.html',
  styleUrls: ['./timestamp-comment-dialog.component.scss']
})
export class TimestampCommentDialogComponent implements OnInit {

  public timestamp: PortcallTimestamp;
  delayCodeOptions: SelectItem[] = [];
  editMode: boolean;

  private previousDelayCode: DelayCode;
  private previousChangeComment: string;

  constructor(public config: DynamicDialogConfig, public ref: DynamicDialogRef) {
  }

  ngOnInit(): void {
    this.timestamp = this.config.data.timestamp;
    this.previousDelayCode = this.timestamp.delayCode as DelayCode;
    this.previousChangeComment = this.timestamp.changeComment;
    this.editMode = this.config.data.editMode;

    this.delayCodeOptions.push({label: 'Select delay code (optional)', value: null});
    this.config.data.delayCode.forEach(delayCode => {
      this.delayCodeOptions.push({label: delayCode.smdgCode, value: delayCode})
    });
  }

  save() {
    this.ref.close(this.timestamp);
  }

  cancelEdit() {
    this.timestamp.delayCode = this.previousDelayCode;
    this.timestamp.changeComment = this.previousChangeComment;
    this.ref.close(null);
  }

  close() {
    this.ref.close(null);
  }
}
