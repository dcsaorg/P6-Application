import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Port } from "../../model/portCall/port";
import { Terminal } from "../../model/portCall/terminal";
import { MessageService, SelectItem } from "primeng/api";
import { DelayCodeService } from "../../controller/services/base/delay-code.service";
import { TimestampCommentDialogComponent } from "../timestamp-comment-dialog/timestamp-comment-dialog.component";
import { DelayCode } from "../../model/portCall/delayCode";
import { DialogService } from "primeng/dynamicdialog";
import { PortService } from "../../controller/services/base/port.service";
import { take } from "rxjs/operators";
import { VesselService } from "../../controller/services/base/vessel.service";
import { Vessel } from "../../model/portCall/vessel";
import { VesselIdToVesselPipe } from "../../controller/pipes/vesselid-to-vessel.pipe";
import { TranslateService } from "@ngx-translate/core";
import { TransportCall } from "../../model/jit/transport-call";
import { TimestampEditorComponent } from "../timestamp-editor/timestamp-editor.component";
import { TimestampAcceptEditorComponent } from "../timestamp-accept-editor/timestamp-accept-editor.component";
import { Globals } from "../../model/portCall/globals";
import { TimestampMappingService } from "../../controller/services/mapping/timestamp-mapping.service";
import { TimestampService } from "../../controller/services/jit/timestamps.service";
import { Timestamp } from 'src/app/model/jit/timestamp';
import { NegotiationCycle } from "../../model/portCall/negotiation-cycle";
import { TimestampDefinitionService } from "../../controller/services/base/timestamp-definition.service";
import { timestampDefinitionTO } from "../../model/jit/timestamp-definition";

@Component({
  selector: 'app-timestamp-table',
  templateUrl: './timestamp-table.component.html',
  styleUrls: ['./timestamp-table.component.scss'],

  providers: [
    DialogService,
    VesselIdToVesselPipe
  ]
})
export class TimestampTableComponent implements OnInit, OnChanges {
  @Input('TransportCallSelected') transportCallSelected: TransportCall;
  @Input('portOfCallNotifier') portofCallNotifier: Port;
  timestamps: Timestamp[];
  unfilteredTimestamps: Timestamp[];
  progressing: boolean = true;
  terminals: Terminal[] = [];
  ports: Port[] = [];
  delayCodes: DelayCode[] = [];
  vessels: Vessel[] = [];
  portOfCall: Port;
  negotiationCycles: SelectItem[] = [];
  portCallParts: SelectItem[] = [];
  selectedPortCallPart: string = null;
  timestampDefinitionMap: Map<string, timestampDefinitionTO> = new Map<string, timestampDefinitionTO>();
  selectedNegotiationCycle: NegotiationCycle = null;

  @Output('timeStampDeletedNotifier') timeStampDeletedNotifier: EventEmitter<Timestamp> = new EventEmitter<Timestamp>()
  @Output('timeStampAcceptNotifier') timeStampAcceptNotifier: EventEmitter<Timestamp> = new EventEmitter<Timestamp>()

  constructor(
    private delayCodeService: DelayCodeService,
    private portService: PortService,
    private vesselService: VesselService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private timestampDefinitionService: TimestampDefinitionService,
    private timestampMappingService: TimestampMappingService,
    public globals: Globals,
    public timestampService: TimestampService
  ) {
  }

  ngOnInit(): void {
    this.vesselService.vesselsObservable.subscribe(() => {
      this.loadTimestamps()
    })
    this.timestampDefinitionService.getTimestampDefinitionsMap().subscribe(map => {
      this.timestampDefinitionMap = map

    });
    this.portService.getPorts().pipe(take(1)).subscribe(ports => this.ports = ports);
    this.delayCodeService.getDelayCodes().pipe(take(1)).subscribe(delayCodes => this.delayCodes = delayCodes);
    this.vesselService.getVessels().pipe().subscribe(vessels => this.vessels = vessels);
    this.progressing = false;
    //this.$timestamps = this.paginatorService.observePaginatedTimestamps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.terminals = this.globals.terminals;
    this.loadTimestamps(true); // populate PortCallParts at start
  }

  public isPrimary(timestamp: Timestamp): boolean {
    return this.globals.config.publisherRoles.includes(timestamp.timestampDefinitionTO?.primaryReceiver);
  }

  filterTimestampsByPortOfCallPart() {
    this.loadTimestamps(false, this.selectedPortCallPart);
    this.filterTimestamps();
  }

  private populatePortCallParts() {
    this.selectedPortCallPart = null;
    let uniqueParts = new Set(this.timestamps.map(timestamp => timestamp.timestampDefinitionTO?.portCallPart).filter((value) => {
      return value !== undefined;
    }));

    this.portCallParts.push({ label: this.translate.instant('general.portCallParts.select'), value: null });

    uniqueParts.forEach(portCallPart => {
      this.portCallParts.push({ label: portCallPart, value: portCallPart })
    })


  }

  private loadTimestamps(populatePortCallParts?: boolean, portOfCallPart?: string) {

    if (this.transportCallSelected) {
      this.progressing = true;
      this.vesselService.getVessels().pipe().subscribe(vessels => this.vessels = vessels);
      this.timestampMappingService.getPortCallTimestampsByTransportCall(this.transportCallSelected, portOfCallPart).subscribe(timestamps => {
        this.colorizetimestampByLocation(timestamps);
        this.unfilteredTimestamps = timestamps;
        this.timestamps = timestamps;
        if (populatePortCallParts) {
          this.portCallParts = [];
          this.negotiationCycles = [];
          if (timestamps.length > 0) {
            this.populatePortCallParts();
            this.negotiationCycles.push({ label: this.translate.instant('general.negotiationCycle.select'), value: null });
            for (let timestamp of timestamps) {
              if (timestamp.isLatestInCycle) {
                this.negotiationCycles.push({ label: timestamp.negotiationCycle.cycleName, value: timestamp.negotiationCycle });
              }
            }
          }
        }
        this.filterTimestamps();
        this.progressing = false;
      });
    }
  }

  refreshTimestamps() {
    this.loadTimestamps(true);
  }

  filterTimestamps() {
    this.timestamps = this.unfilteredTimestamps.filter(ts => {
      if (this.selectedNegotiationCycle && ts.negotiationCycle?.cycleKey != this.selectedNegotiationCycle.cycleKey) {
        return false;
      }
      return true;
    });
  }

  isOutGoing(timestamp: Timestamp): boolean {
    const publisherRoles = this.globals.config.publisherRoles;
    return publisherRoles.includes(timestamp.publisherRole) &&
      // Special-case: If we are both the sender *and* the primary receiver, then we count this as an "ingoing"
      // timestamp.  This makes it easier to add all roles for local testing and still see the "accept/reject"
      // buttons.
      //
      // If you are here because you want to double check the "secondary timestamp" flow, just remove
      // the relevant roles from "publisherRoles" from config.json. :)
      (!timestamp.timestampDefinitionTO || !publisherRoles.includes(timestamp.timestampDefinitionTO.primaryReceiver));
  }

  showComment(timestamp: Timestamp) {
    const delayCode = this.delayCodes.find((delayCode) => delayCode.smdgCode == timestamp.delayReasonCode, null);
    this.dialogService.open(TimestampCommentDialogComponent, {
      header: this.translate.instant('general.comment.header'),
      width: '50%', data: { timestamp: timestamp, delayCode: delayCode, editMode: timestamp.modifiable }
    }).onClose.subscribe((ts: Timestamp) => {
    });
  }

  openCreationDialog(timestamp: Timestamp) {
    const timestampEditor = this.dialogService.open(TimestampEditorComponent, {
      header: this.translate.instant('general.timestamp.create.label'),
      width: '75%',
      data: {
        transportCall: this.transportCallSelected,
        timestamps: this.timestamps,
        respondingToTimestamp: timestamp,
        ports: this.ports
      }
    });
    timestampEditor.onClose.subscribe((timestamp) => {
      if (timestamp) {
        this.loadTimestamps()
      }
    });
  }

  openAcceptDialog(timestamp: Timestamp) {
    let timestampShallowClone = Object.assign({}, timestamp);
    timestampShallowClone.timestampDefinitionTO = timestamp.timestampDefinitionTO.acceptTimestampDefinitionEntity;
    timestampShallowClone.logOfTimestamp = new Date();
    // Avoid cloning the remark and delayReasonCode from the original sender.  It would just be confusing to them
    // so see their own comment in a reply to them.
    timestampShallowClone.remark = null;
    timestampShallowClone.delayReasonCode = null;
    const timestampEditor = this.dialogService.open(TimestampAcceptEditorComponent, {
      header: this.translate.instant('general.timestamp.accept.label'),
      width: '75%',
      data: {
        transportCall: this.transportCallSelected,
        timestamps: this.timestamps,
        respondingToTimestamp: timestampShallowClone,
        ports: this.ports,
        timestampResponseStatus: "Accepted"
      }
    });
    timestampEditor.onClose.subscribe((timestamp) => {
      if (timestamp) {
        this.loadTimestamps()
      }
    });
  }
  openRejectDialog(timestamp: Timestamp) {
    let timestampShallowClone = Object.assign({}, timestamp);
    timestampShallowClone.timestampDefinitionTO = timestamp.timestampDefinitionTO.rejectTimestampDefinitionEntity;
    timestampShallowClone.logOfTimestamp = new Date();
    // Avoid cloning the remark and delayReasonCode from the original sender.  It would just be confusing to them
    // so see their own comment in a reply to them.
    timestampShallowClone.remark = null;
    timestampShallowClone.delayReasonCode = null;
    const timestampEditor = this.dialogService.open(TimestampAcceptEditorComponent, {
      header: this.translate.instant('general.timestamp.reject.label'),
      width: '75%',
      data: {
        transportCall: this.transportCallSelected,
        timestamps: this.timestamps,
        respondingToTimestamp: timestampShallowClone,
        ports: this.ports,
        timestampResponseStatus: "Rejected"
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


