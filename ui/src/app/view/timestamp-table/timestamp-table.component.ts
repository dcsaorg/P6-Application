import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../../model/base/portcall-timestamp";
import {PortcallTimestampService} from "../../controller/services/base/portcall-timestamp.service";
import {Port} from "../../model/base/port";
import {Terminal} from "../../model/base/terminal";
import {ConfirmationService, MessageService} from "primeng/api";
import {PortCallTimestampTypeToStringPipe} from "../../controller/pipes/port-call-timestamp-type-to-string.pipe";
import {PortIdToPortPipe} from "../../controller/pipes/port-id-to-port.pipe";
import {PortcallTimestampType} from "../../model/base/portcall-timestamp-type.enum";
import {PortCallTimestampTypeToEnumPipe} from "../../controller/pipes/port-call-timestamp-type-to-enum.pipe";
import {DelayCodeService} from "../../controller/services/base/delay-code.service";
import {TimestampCommentDialogComponent} from "../timestamp-comment-dialog/timestamp-comment-dialog.component";
import {DelayCode} from "../../model/base/delayCode";
import {DialogService} from "primeng/dynamicdialog";
import {PortService} from "../../controller/services/base/port.service";
import {TerminalService} from "../../controller/services/base/terminal.service";
import {Observable} from "rxjs";
import {PaginatorService} from "../../controller/services/base/paginator.service";
import {take} from "rxjs/operators";
import {VesselService} from "../../controller/services/base/vessel.service";
import {Vessel} from "../../model/base/vessel";
import {VesselIdToVesselPipe} from "../../controller/pipes/vesselid-to-vessel.pipe";
import {TranslateService} from "@ngx-translate/core";
import {TransportCall} from "../../model/OVS/transport-call";

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
  @Input('TransportCallSelected') transportCallSelected: TransportCall;
  timestamps: PortcallTimestamp[];
  progressing: boolean = true;
  terminals: Terminal[] = [];
  ports: Port[] = [];
  delayCodes: DelayCode[] = [];
  vessels: Vessel[] = [];

  @Output('timeStampDeletedNotifier') timeStampDeletedNotifier: EventEmitter<PortcallTimestamp> = new EventEmitter<PortcallTimestamp>()
  @Output('timeStampAcceptNotifier') timeStampAcceptNotifier: EventEmitter<PortcallTimestamp> = new EventEmitter<PortcallTimestamp>()

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
              private translate: TranslateService,
  ) {
  }

  ngOnInit(): void {
    this.portService.getPorts().pipe(take(1)).subscribe(ports => this.ports = ports);
    this.terminalService.getTerminals().pipe(take(1)).subscribe(terminals => this.terminals = terminals);
    this.delayCodeService.getDelayCodes().pipe(take(1)).subscribe(delayCodes => this.delayCodes = delayCodes);
    this.vesselService.getVessels().pipe(take(1)).subscribe(vessels => this.vessels = vessels);
    this.progressing = false;
    //this.$timestamps = this.paginatorService.observePaginatedTimestamps();



  }

  ngOnChanges(changes: SimpleChanges): void {
    console.debug(this.transportCallSelected.transportCallID+" Selected");
    this.loadTimestamps();
  }


  private loadTimestamps() {
    this.progressing = true;
    this.portcallTimestampService.getPortcallTimestampsByTransportCall(this.transportCallSelected).subscribe(timestamps => {
      this.colorizeProcessId(timestamps);
      this.timestamps = timestamps;
      console.log(timestamps);
      this.progressing = false;
    });
  }

  acceptTimestamp(timestamp: PortcallTimestamp) {

    this.portcallTimestampService.acceptTimestamp(timestamp).subscribe((newPortCallTimestamp: PortcallTimestamp) => {
      const port = this.portIdToPortPipe.transform(timestamp.portOfCall as number, this.ports);
      const typeOrigin = this.portCallTimestampTypeToEnumPipe.transform(timestamp.timestampType as PortcallTimestampType);
      const typeNew = this.portCallTimestampTypeToEnumPipe.transform(newPortCallTimestamp.timestampType as PortcallTimestampType);
      this.messageService.add({
        key: "TimestampToast",
        severity: 'success',
        summary: 'Successfully accepted the ' + typeOrigin + " with an " + typeNew + " for port " + port.unLocode,
        detail: ''
      });
      this.timeStampAcceptNotifier.emit(timestamp);
    }, error => this.messageService.add({
      key: 'TimestampToast',
      severity: 'error',
      summary: 'Error while trying to accept the timestamp',
      detail: error.message
    }));
  }


  showComment(timestamp: PortcallTimestamp) {
    if (timestamp.delayCode != null && !(timestamp.delayCode as DelayCode).smdgCode) {
      this.delayCodeService.getDelayCode(timestamp.delayCode as number).subscribe(data => {
        timestamp.delayCode = data;

      });
    }

    this.dialogService.open(TimestampCommentDialogComponent, {
      header: this.translate.instant('general.comment.header'),
      width: '50%', data: {timestamp: timestamp, delayCode: this.delayCodes, editMode: timestamp.modifiable}
    }).onClose.subscribe((portcallTimestamp: PortcallTimestamp) => {
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

  refreshTable() {
    console.debug("Refresh table data");
    this.paginatorService.refreshNotifier().next();
  }

  private colorizeProcessId(timestamps: PortcallTimestamp[]){
    const color = this.transportCallSelected.sequenceColor
    timestamps.forEach(function (timestamp){
      timestamp.sequenceColor = color;
    });

  }
}


