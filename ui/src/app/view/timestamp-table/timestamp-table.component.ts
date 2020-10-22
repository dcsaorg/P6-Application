import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {PortcallTimestampService} from "../../controller/portcall-timestamp.service";
import {Port} from "../../model/port";
import {Terminal} from "../../model/terminal";
import {ConfirmationService, MessageService} from "primeng/api";
import {PortCallTimestampTypeToStringPipe} from "../../controller/port-call-timestamp-type-to-string.pipe";
import {PortIdToPortPipe} from "../../controller/port-id-to-port.pipe";
import {PortcallTimestampType} from "../../model/portcall-timestamp-type.enum";
import {PortCallTimestampTypeToEnumPipe} from "../../controller/port-call-timestamp-type-to-enum.pipe";
import {DelayCodeService} from "../../controller/delay-code.service";
import {TimestampCommentDialogComponent} from "../timestamp-comment-dialog/timestamp-comment-dialog.component";
import {DelayCode} from "../../model/delayCode";
import {DialogService} from "primeng/dynamicdialog";

@Component({
  selector: 'app-timestamp-table',
  templateUrl: './timestamp-table.component.html',
  styleUrls: ['./timestamp-table.component.scss'],

  providers: [
    DialogService,

    PortCallTimestampTypeToEnumPipe,
    PortCallTimestampTypeToStringPipe,
    PortIdToPortPipe,
  ]
})
export class TimestampTableComponent {
  @Input('vesselId') vesselId: number;
  @Input('ports') ports: Port[];
  @Input('terminals') terminals: Terminal[];
  @Input('delayCodes') delayCodes: DelayCode[];
  @Input('timestamps') timestamps: PortcallTimestamp[];

  @Output('timeStampDeletedNotifier') timeStampDeletedNotifier: EventEmitter<PortcallTimestamp> = new EventEmitter<PortcallTimestamp>()

  constructor(private portcallTimestampService: PortcallTimestampService,
              private delayCodeService: DelayCodeService,

              private confirmationService: ConfirmationService,
              private dialogService: DialogService,
              private messageService: MessageService,

              private portCallTimestampTypeToEnumPipe: PortCallTimestampTypeToEnumPipe,
              private portCallTimestampTypeToStringPipe: PortCallTimestampTypeToStringPipe,
              private portIdToPortPipe: PortIdToPortPipe,
  ) {
  }

  deleteTimestamp(timestamp: any) {
    const port = this.portIdToPortPipe.transform(timestamp.portOfCall as number, this.ports);
    const type = this.portCallTimestampTypeToEnumPipe.transform(timestamp.timestampType as PortcallTimestampType);
    this.confirmationService.confirm({
      message: "Do you really want to delete the " + type + " port call timestamp to the port " + port.name + " (" + port.unLocode + ")",
      key: 'deletetimestamp',
      accept: () => {
        this.portcallTimestampService.deleteTimestamp(timestamp.id).subscribe(data => {
          this.messageService.add({
            key: 'TimestampRemoveSuccess',
            severity: 'success',
            summary: 'Successfully removed port call timestamp from vessel',
            detail: ''
          });
          this.timeStampDeletedNotifier.emit(timestamp);

        }, error => this.messageService.add({
          key: 'TimestampRemoveError',
          severity: 'error',
          summary: 'Error while removing port call timestamp',
          detail: error.message
        }));
      }
    });
  }

  showComment(timestamp: PortcallTimestamp) {
    if (timestamp.delayCode != null && !(timestamp.delayCode as DelayCode).smdgCode) {
      this.delayCodeService.getDelayCode(timestamp.delayCode as number).subscribe(data => {
        timestamp.delayCode = data;
      });
    }

    this.dialogService.open(TimestampCommentDialogComponent, {
      header: 'Add change comment to port call event',
      width: '50%', data: {timestamp: timestamp, delayCode: this.delayCodes, readonly: true}
    });
  }
}
