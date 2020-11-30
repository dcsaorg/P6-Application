import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../../model/portcall-timestamp";
import {PortcallTimestampService} from "../../controller/services/portcall-timestamp.service";
import {Port} from "../../model/port";
import {Terminal} from "../../model/terminal";
import {ConfirmationService, MessageService} from "primeng/api";
import {PortCallTimestampTypeToStringPipe} from "../../controller/pipes/port-call-timestamp-type-to-string.pipe";
import {PortIdToPortPipe} from "../../controller/pipes/port-id-to-port.pipe";
import {PortcallTimestampType} from "../../model/portcall-timestamp-type.enum";
import {PortCallTimestampTypeToEnumPipe} from "../../controller/pipes/port-call-timestamp-type-to-enum.pipe";
import {DelayCodeService} from "../../controller/services/delay-code.service";
import {TimestampCommentDialogComponent} from "../timestamp-comment-dialog/timestamp-comment-dialog.component";
import {DelayCode} from "../../model/delayCode";
import {DialogService} from "primeng/dynamicdialog";
import {PortService} from "../../controller/services/port.service";
import {TerminalService} from "../../controller/services/terminal.service";
import {Observable} from "rxjs";
import {PaginatorService} from "../../controller/services/paginator.service";
import {take} from "rxjs/operators";
import {VesselService} from "../../controller/services/vessel.service";
import {Vessel} from "../../model/vessel";
import {VesselIdToVesselPipe} from "../../controller/pipes/vesselid-to-vessel.pipe";

@Component({
  selector: 'app-timestamp-table',
  templateUrl: './timestamp-table.component.html',
  styleUrls: ['./timestamp-table.component.scss'],

  providers: [
    DialogService,
    PortCallTimestampTypeToEnumPipe,
    PortCallTimestampTypeToStringPipe,
    PortIdToPortPipe,
    VesselIdToVesselPipe
  ]
})
export class TimestampTableComponent implements OnInit, OnChanges {
  @Input('vesselId') vesselId: number;
  $timestamps: Observable<PortcallTimestamp[]>;

  terminals: Terminal[] = [];
  ports: Port[] = [];
  delayCodes: DelayCode[] = [];
  vessels: Vessel[] = [];

  @Output('timeStampDeletedNotifier') timeStampDeletedNotifier: EventEmitter<PortcallTimestamp> = new EventEmitter<PortcallTimestamp>()

  highestTimestampId: number;

  constructor(private portcallTimestampService: PortcallTimestampService,
              private delayCodeService: DelayCodeService,
              private portService: PortService,
              private terminalService: TerminalService,
              private vesselService: VesselService,

              private confirmationService: ConfirmationService,
              private dialogService: DialogService,
              private messageService: MessageService,
              private paginatorService: PaginatorService,

              private portCallTimestampTypeToEnumPipe: PortCallTimestampTypeToEnumPipe,
              private portCallTimestampTypeToStringPipe: PortCallTimestampTypeToStringPipe,
              private portIdToPortPipe: PortIdToPortPipe,
  ) {
  }

  ngOnInit(): void {
    this.portService.getPorts().pipe(take(1)).subscribe(ports => this.ports = ports);
    this.terminalService.getTerminals().pipe(take(1)).subscribe(terminals => this.terminals = terminals);
    this.delayCodeService.getDelayCodes().pipe(take(1)).subscribe(delayCodes => this.delayCodes = delayCodes);
    this.vesselService.getVessels().pipe(take(1)).subscribe(vessels => this.vessels = vessels);

    this.$timestamps = this.paginatorService.observePaginatedTimestamps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.vesselId && this.vesselId > 0) {
      this.portcallTimestampService.getHighesTimestampId(this.vesselId).subscribe(highestTimestampId => {
        this.highestTimestampId = highestTimestampId;
      })
    }
    console.debug(history);
  }

  deleteTimestamp(timestamp: any) {
    const port = this.portIdToPortPipe.transform(timestamp.portOfCall as number, this.ports);
    const type = this.portCallTimestampTypeToEnumPipe.transform(timestamp.timestampType as PortcallTimestampType);
    this.confirmationService.confirm({
      message: "Do you really want to delete the " + type + " port call timestamp to the port " + port.name + " (" + port.unLocode + ")",
      key: 'deletetimestamp',
      accept: () => {
        this.portcallTimestampService.deleteTimestamp(timestamp.id).subscribe(() => {
          this.messageService.add({
            key: 'TimestampToast',
            severity: 'success',
            summary: 'Successfully removed port call timestamp from vessel',
            detail: ''
          });
          this.timeStampDeletedNotifier.emit(timestamp);

        }, error => this.messageService.add({
          key: 'TimestampToast',
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
      width: '50%', data: {timestamp: timestamp, delayCode: this.delayCodes, editMode: true}
    }).onClose.subscribe((portcallTimestamp : PortcallTimestamp) => {
      if (portcallTimestamp != null) {
        this.portcallTimestampService.updatePortcallTimestampDelayCodeAndComment(portcallTimestamp).subscribe(() => {
          console.log("Updated port call timestamp " + timestamp.id);

          this.messageService.add({
            key: 'TimestampToast',
            severity: 'success',
            summary: 'Successfully updated the timestamp with id ' + timestamp.id,
            detail: ''
          })
        }, error => {
          console.log(error);
          this.messageService.add({
            key: 'TimestampToast',
            severity: 'error',
            summary: 'Error while updating the timestamp with id ' + timestamp.id,
            detail: error.message
          });
        });
      }
    });
  }
}
