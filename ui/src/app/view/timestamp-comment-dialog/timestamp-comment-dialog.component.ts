import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {Timestamp} from 'src/app/model/ovs/timestamp';
import {DelayCode} from "../../model/portCall/delayCode";

@Component({
  selector: 'app-timestamp-comment-dialog',
  templateUrl: './timestamp-comment-dialog.component.html',
  styleUrls: ['./timestamp-comment-dialog.component.scss']
})
export class TimestampCommentDialogComponent implements OnInit {

  public timestamp: Timestamp;
  delayReasonCode: string;
  delayCode: DelayCode;
  editMode: boolean;

  private previousDelayCode: string;
  private previousRemark: string;

  constructor(public config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              private translate: TranslateService,
              ) {
  }

  ngOnInit(): void {
    this.timestamp = this.config.data.timestamp;
    this.delayCode = this.config.data.delayCode;
    this.previousDelayCode = this.timestamp.delayReasonCode;
    this.previousRemark = this.timestamp.remark;
    this.delayReasonCode = this.timestamp.delayReasonCode;
    this.editMode = this.config.data.editMode;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {

    });
  }

  save() {
    this.ref.close(this.timestamp);
  }
  cancelEdit() {
    this.timestamp.delayReasonCode = this.previousDelayCode;
    this.timestamp.remark = this.previousRemark;
    this.ref.close(null);
  }
  close() {
    this.ref.close(null);
  }

}
