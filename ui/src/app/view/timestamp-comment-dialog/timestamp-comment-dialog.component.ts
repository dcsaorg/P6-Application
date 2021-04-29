import {Component, OnInit} from '@angular/core';
import {PortcallTimestamp} from "../../model/portCall/portcall-timestamp";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {SelectItem} from "primeng/api";
import {DelayCode} from "../../model/portCall/delayCode";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-timestamp-comment-dialog',
  templateUrl: './timestamp-comment-dialog.component.html',
  styleUrls: ['./timestamp-comment-dialog.component.scss']
})
export class TimestampCommentDialogComponent implements OnInit {

  public timestamp: PortcallTimestamp;
  delayCode: DelayCode;
  editMode: boolean;

  private previousDelayCode: DelayCode;
  private previousChangeComment: string;

  constructor(public config: DynamicDialogConfig,
              public ref: DynamicDialogRef,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.timestamp = this.config.data.timestamp;
    this.previousDelayCode = this.timestamp.delayCode as DelayCode;
    this.previousChangeComment = this.timestamp.changeComment;
    this.editMode = this.config.data.editMode;
    const delayCodes : DelayCode[] = this.config.data.delayCode;

    if(this.timestamp.delayCode != null){
      for(let delayCode of delayCodes){
        if (delayCode.smdgCode == this.timestamp.delayCode){
          this.delayCode = delayCode;
        }
      }
    }

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {

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
