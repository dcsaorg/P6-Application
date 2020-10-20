import {ApplicationRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {PortcallTimestampService} from "../../controller/portcall-timestamp.service";
import {Port} from "../../model/port";
import {Terminal} from "../../model/terminal";
import {ConfirmationService} from "primeng/api";
import {PortCallTimestampTypeToStringPipe} from "../../controller/port-call-timestamp-type-to-string.pipe";
import {PortIdToPortPipe} from "../../controller/port-id-to-port.pipe";
import {PortcallTimestampType} from "../../model/portcall-timestamp-type.enum";
import {PortCallTimestampTypeToEnumPipe} from "../../controller/port-call-timestamp-type-to-enum.pipe";
import {ApplicationToolTips} from "../../model/ToolTips";

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

  private toolTips = ApplicationToolTips;


  constructor(private portcallTimestampService: PortcallTimestampService,
              private confirmationService: ConfirmationService,
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
          this.timeStampDeletedNotifier.emit(timestamp);
        });
      }
    });
  }
}
