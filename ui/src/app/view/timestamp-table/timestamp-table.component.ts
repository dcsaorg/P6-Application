import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../../model/portCall/portcall-timestamp";
import {Port} from "../../model/portCall/port";
import {Terminal} from "../../model/portCall/terminal";
import {ConfirmationService, MessageService} from "primeng/api";
import {PortCallTimestampTypeToStringPipe} from "../../controller/pipes/port-call-timestamp-type-to-string.pipe";
import {PortIdToPortPipe} from "../../controller/pipes/port-id-to-port.pipe";
import {PortCallTimestampTypeToEnumPipe} from "../../controller/pipes/port-call-timestamp-type-to-enum.pipe";
import {DelayCodeService} from "../../controller/services/base/delay-code.service";
import {TimestampCommentDialogComponent} from "../timestamp-comment-dialog/timestamp-comment-dialog.component";
import {DelayCode} from "../../model/portCall/delayCode";
import {DialogService} from "primeng/dynamicdialog";
import {PortService} from "../../controller/services/base/port.service";
import {TerminalService} from "../../controller/services/base/terminal.service";
import {PaginatorService} from "../../controller/services/base/paginator.service";
import {take} from "rxjs/operators";
import {VesselService} from "../../controller/services/base/vessel.service";
import {Vessel} from "../../model/portCall/vessel";
import {VesselIdToVesselPipe} from "../../controller/pipes/vesselid-to-vessel.pipe";
import {TranslateService} from "@ngx-translate/core";
import {TransportCall} from "../../model/ovs/transport-call";
import {TimestampEditorComponent} from "../timestamp-editor/timestamp-editor.component";
import {Globals} from "../../model/portCall/globals";
import {TimestampMappingService} from "../../controller/services/mapping/timestamp-mapping.service";
import {TimestampService} from "../../controller/services/ovs/timestamps.service";
import {Timestamp} from 'src/app/model/ovs/timestamp';

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
  @Input('portOfCallNotifier') portofCallNotifier: Port;
  timestamps: Timestamp[];
  progressing: boolean = true;
  terminals: Terminal[] = [];
  ports: Port[] = [];
  delayCodes: DelayCode[] = [];
  vessels: Vessel[] = [];
  portOfCall: Port;

  @Output('timeStampDeletedNotifier') timeStampDeletedNotifier: EventEmitter<Timestamp> = new EventEmitter<Timestamp>()
  @Output('timeStampAcceptNotifier') timeStampAcceptNotifier: EventEmitter<Timestamp> = new EventEmitter<Timestamp>()

  highestTimestampId: number;

  constructor(
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
              private timestampMappingService: TimestampMappingService,
              private timestampService: TimestampService,
              public globals: Globals
  ) {
  }

  ngOnInit(): void {
    this.vesselService.vesselsObservable.subscribe(() => {
      this.loadTimestamps()
    })
    this.portService.getPorts().pipe(take(1)).subscribe(ports => this.ports = ports);
    this.delayCodeService.getDelayCodes().pipe(take(1)).subscribe(delayCodes => this.delayCodes = delayCodes);
    this.vesselService.getVessels().pipe().subscribe(vessels => this.vessels = vessels);
    this.progressing = false;
    //this.$timestamps = this.paginatorService.observePaginatedTimestamps();


  }

  ngOnChanges(changes: SimpleChanges): void {
    this.terminals = this.globals.terminals;
    this.loadTimestamps();
  }

  public isPrimary(portCallTimestamp: Timestamp): boolean {
    return this.timestampService.isPrimary(portCallTimestamp, this.globals.config.publisherRole)
  }

  private loadTimestamps() {
    if (this.transportCallSelected) {
      this.progressing = true;
      this.vesselService.getVessels().pipe().subscribe(vessels => this.vessels = vessels);
      this.timestampMappingService.getPortCallTimestampsByTransportCall(this.transportCallSelected).subscribe(timestamps => {
        this.colorizetimestampByLocation(timestamps);
        this.timestamps = timestamps;
        this.progressing = false;
      });
    }
  }

  refreshTimestamps() {
    this.loadTimestamps();
  }

  isOutGoing(timestamp: Timestamp): boolean {
    return timestamp.publisherRole == this.globals.config.publisherRole;

  }


  acceptTimestamp(timestamp: Timestamp) {
    let timestampShallowClone = Object.assign({}, timestamp);
    timestampShallowClone.timestampType = timestamp.response;
    timestampShallowClone.logOfTimestamp = new Date();
    this.timestampMappingService.addPortCallTimestamp(timestampShallowClone).subscribe(() => {
        this.loadTimestamps();
        this.messageService.add({
          key: "TimestampToast",
          severity: 'success',
          summary: 'Successfully accepted the Timestamp: ' + timestamp.timestampType + " \n for port:" + timestamp.UNLocationCode,
          detail: ''
        });
        this.timeStampAcceptNotifier.emit(timestamp);
      },
      error => this.messageService.add({
        key: 'TimestampToast',
        severity: 'error',
        summary: 'Error while trying to accept the timestamp',
        detail: error.message
      })
    );
  }


  showComment(timestamp: PortcallTimestamp) {
    this.dialogService.open(TimestampCommentDialogComponent, {
      header: this.translate.instant('general.comment.header'),
      width: '50%', data: {timestamp: timestamp, delayCode: this.delayCodes, editMode: timestamp.modifiable}
    }).onClose.subscribe((portcallTimestamp: PortcallTimestamp) => {
    });
  }

  openCreationDialog() {
    const timestampEditor = this.dialogService.open(TimestampEditorComponent, {
      header: this.translate.instant('general.timestamp.create.label'),
      width: '75%',
      data: {
        transportCall: this.transportCallSelected,
        timestamps: this.timestamps,
      }
    });
    timestampEditor.onClose.subscribe((timestamp) => {
      if (timestamp) {
        this.loadTimestamps()
      }
    });

  }

  /*
    Function that will colorize
    //@ToDo Move this function to postProcessing in timestampService
   */
  private colorizetimestampByLocation(timestamps: Timestamp[]) {
    let colourPalette: string[] = new Array("#30a584", "#f5634a", "#d00fc2", "#fad089", "#78b0ee", "#19ee79", "#d0a9ff", "#ff9d00", "#b03e3e", "#0400ff")

    let portaproaches = new Map();
    // extract processIDs
    timestamps.forEach(function (timestamp) {
      portaproaches.set(timestamp.locationType + timestamp.facilityTypeCode, null);
    });
    let i = 0
    // assign color to portApproaches
    for (let key of portaproaches.keys()) {
      portaproaches.set(key, colourPalette[i]);
      i++;
      if (i == colourPalette.length) {
        i = 0;
      }
    }
    //assign color to timestamp
    timestamps.forEach(function (timestamp) {
      timestamp.sequenceColor = portaproaches.get(timestamp.locationType + timestamp.facilityTypeCode);
    });

  }


}


