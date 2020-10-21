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

@Component({
  selector: 'app-timestamp-table',
  templateUrl: './timestamp-table.component.html',
  styleUrls: ['./timestamp-table.component.scss'],

  providers: [PortIdToPortPipe, PortCallTimestampTypeToStringPipe, PortCallTimestampTypeToEnumPipe]
})
export class TimestampTableComponent {
  @Input('vesselId') vesselId: number;
  @Input('ports') ports: Port[];
  @Input('terminals') terminals: Terminal[];
  @Input('timestamps') timestamps: PortcallTimestamp[];

  @Output('timeStampDeletedNotifier') timeStampDeletedNotifier: EventEmitter<PortcallTimestamp> = new EventEmitter<PortcallTimestamp>()

  constructor(private portcallTimestampService: PortcallTimestampService,
              private confirmationService: ConfirmationService,
              private messageService: MessageService,
              private portIdToPortPipe: PortIdToPortPipe,
              private portCallTimestampTypeToStringPipe: PortCallTimestampTypeToStringPipe,
              private portCallTimestampTypeToEnumPipe: PortCallTimestampTypeToEnumPipe) {
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
            detail: ''});
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
}
