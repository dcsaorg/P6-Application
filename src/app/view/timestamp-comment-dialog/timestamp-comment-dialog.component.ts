import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {DelayCode} from "../../model/portCall/delayCode";
import {TimestampInfo} from "../../model/jit/timestamp-info";

@Component({
  selector: 'app-timestamp-comment-dialog',
  templateUrl: './timestamp-comment-dialog.component.html',
  styleUrls: ['./timestamp-comment-dialog.component.scss']
})
export class TimestampCommentDialogComponent implements OnInit {

  delayReasonCode: string;
  delayCode: DelayCode;
  remark: string;

  constructor(public config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              private translate: TranslateService,
              ) {
  }

  ngOnInit(): void {
    const timestampInfo = this.config.data.timestampInfo;
    this.delayCode = this.config.data.delayCode;
    this.remark = timestampInfo.operationsEventTO.remark;
    this.delayReasonCode = timestampInfo.operationsEventTO.delayReasonCode;

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {

    });
  }

  close() {
    this.ref.close(null);
  }

}
