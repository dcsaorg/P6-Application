import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Port } from "../../model/portCall/port";
import { SelectItem } from "primeng/api";
import { DelayCodeService } from "../../controller/services/base/delay-code.service";
import { TimestampCommentDialogComponent } from "../timestamp-comment-dialog/timestamp-comment-dialog.component";
import { DelayCode } from "../../model/portCall/delayCode";
import { DialogService } from "primeng/dynamicdialog";
import { take } from "rxjs/operators";
import { VesselService } from "../../controller/services/base/vessel.service";
import { Vessel } from "../../model/portCall/vessel";
import { TranslateService } from "@ngx-translate/core";
import { TransportCall } from "../../model/jit/transport-call";
import { TimestampEditorComponent } from "../timestamp-editor/timestamp-editor.component";
import { Globals } from "../../model/portCall/globals";
import { TimestampMappingService } from "../../controller/services/mapping/timestamp-mapping.service";
import { Timestamp } from 'src/app/model/jit/timestamp';
import { NegotiationCycle } from "../../model/portCall/negotiation-cycle";
import { TimestampInfo } from "../../model/jit/timestamp-info";
import { PublisherRole } from "../../model/enums/publisherRole";
import { Terminal } from "../../model/portCall/terminal";
import { TerminalService } from "../../controller/services/base/terminal.service";
import { TimestampResponseStatus } from 'src/app/model/enums/timestamp-response-status';
import { TimestampDefinitionService } from 'src/app/controller/services/base/timestamp-definition.service';

const NO_FILTER = null;

@Component({
  selector: 'app-timestamp-table',
  templateUrl: './timestamp-table.component.html',
  styleUrls: ['./timestamp-table.component.scss'],

  providers: [
    DialogService,
  ]
})
export class TimestampTableComponent implements OnInit, OnChanges {
  @Input('TransportCallSelected') transportCallSelected: TransportCall;
  @Input('portOfCallNotifier') portofCallNotifier: Port;
  timestampInfos: TimestampInfo[];
  unfilteredTimestampInfos: TimestampInfo[];
  progressing: boolean = true;
  filterTerminals: any[] = [];
  filterTerminal: Terminal | null = null;
  delayCodes: DelayCode[] = [];
  vessels: Vessel[] = [];
  portOfCall: Port;
  portCallParts: SelectItem[] = [];
  filterNegotiationCycles: SelectItem[];
  selectedPortCallPart: string = null;
  filterNegotiationCycle: NegotiationCycle = null;

  @Output('timeStampDeletedNotifier') timeStampDeletedNotifier: EventEmitter<Timestamp> = new EventEmitter<Timestamp>()
  @Output('timeStampAcceptNotifier') timeStampAcceptNotifier: EventEmitter<Timestamp> = new EventEmitter<Timestamp>()

  constructor(
    private delayCodeService: DelayCodeService,
    private vesselService: VesselService,
    private dialogService: DialogService,
    private translate: TranslateService,
    private timestampMappingService: TimestampMappingService,
    private terminalService: TerminalService,
    private timestampDefinitionService: TimestampDefinitionService,
    public globals: Globals,
  ) {
  }

  ngOnInit(): void {
    this.vesselService.vesselsObservable.subscribe(() => {
      // Triggered on vessel renames (etc.). Reload the timestamps (as each row show the vessel name)
      this.loadTimestamps()
    })
    this.delayCodeService.getDelayCodes().pipe(take(1)).subscribe(delayCodes => this.delayCodes = delayCodes);
    this.progressing = false;
    this.loadTimestamps()
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.populateTerminalFilter();
    this.populatenegotiationCyclesFilter();
    this.loadTimestamps(true);
  }

  private populateTerminalFilter() {
    this.filterTerminals = []
    this.filterTerminal = NO_FILTER;
    if (this.transportCallSelected) {
      this.terminalService.getTerminalsByUNLocationCode(this.transportCallSelected.UNLocationCode)
        .subscribe(terminals => {
          const PORT_LEVEL_FILTER: Terminal = {
            facilityName: this.translate.instant('general.terminal.portLevelFilter'),
            facilityBICCode: "NULL",
            facilitySMDGCode: "NULL",
            UNLocationCode: "N/A",
          };

          this.filterTerminals = [
            { label: this.translate.instant('general.terminal.select'), value: NO_FILTER },
            { label: PORT_LEVEL_FILTER.facilityName, value: PORT_LEVEL_FILTER }
          ]
          for (let terminal of terminals) {
            this.filterTerminals.push({ label: terminal.facilitySMDGCode, value: terminal })
          }
        })
    }
  }

  private populatenegotiationCyclesFilter() {
    this.filterNegotiationCycles = []
    this.filterNegotiationCycle = NO_FILTER;
    this.timestampDefinitionService.getNegotiationCycles().subscribe(negotiationCycles => {
      this.filterNegotiationCycles.push({ label: this.translate.instant('general.negotiationCycle.select'), value: NO_FILTER });
      for (let negotiationCycle of negotiationCycles) {
        this.filterNegotiationCycles.push({ label: negotiationCycle.cycleName, value: negotiationCycle })
      }
    })
  }

  public isPrimaryReceiver(timestampInfo: TimestampInfo): boolean {
    return this.hasOverlap(
      this.globals.config.publisherRoles,
      timestampInfo.timestampDefinitionTO.publisherPattern.map(x => x.primaryReceiver)
    )
  }

  filterTimestampsByPortOfCallPart() {
    this.timestampInfos = this.unfilteredTimestampInfos.filter(ts => {
      if (this.selectedPortCallPart && ts.timestampDefinitionTO.portCallPart != this.selectedPortCallPart) {
        return false;
      }
      return true;
    });
  }


  private populatePortCallParts() {
    this.selectedPortCallPart = null;
    let uniqueParts = new Set(this.timestampInfos.map(timestamp => timestamp.timestampDefinitionTO?.portCallPart).filter((value) => {
      return value !== undefined;
    }));

    this.portCallParts.push({ label: this.translate.instant('general.portCallParts.select'), value: null });

    uniqueParts.forEach(portCallPart => {
      this.portCallParts.push({ label: portCallPart, value: portCallPart })
    })


  }

  private loadTimestamps(populateFilters?: boolean, portOfCallPart?: string) {

    if (this.transportCallSelected) {
      this.progressing = true;
      this.timestampMappingService.getPortCallTimestampsByTransportCall(this.transportCallSelected, this.filterTerminal, this.filterNegotiationCycle?.cycleKey).subscribe(timestampInfos => {
        this.colorizetimestampByLocation(timestampInfos);
        timestampInfos.forEach(timestampInfo => {
          timestampInfo.operationsEventTO.transportCall.vessel = this.transportCallSelected.vessel;
        });
        this.unfilteredTimestampInfos = timestampInfos;
        this.timestampInfos = timestampInfos;
        if (populateFilters) {
          this.portCallParts = [];
          this.populatePortCallParts();
        }
        this.progressing = false;
      });
    }
  }

  refreshTimestamps() {
    this.loadTimestamps(true);
  }

  isOmitted(a: TimestampInfo): boolean {
    if (!this.transportCallSelected.omitCreatedDateTime) {
      return false;
    }
    if (a.operationsEventTO.eventCreatedDateTime < this.transportCallSelected.omitCreatedDateTime) {
      return true;
    }
    // Avoid a strikethrough of the OMIT itself ot make it more prominent.
    return a.operationsEventTO.eventCreatedDateTime == this.transportCallSelected.omitCreatedDateTime
      && a.operationsEventTO.operationsEventTypeCode != 'OMIT';
  }

  private hasOverlap(a: PublisherRole[], b: PublisherRole[]): boolean {
    return !!a.find((val1) => {
      return b.find((val2) => val1 === val2);
    });
  }

  isOutGoing(timestampInfo: TimestampInfo): boolean {
    const publisherRoles = this.globals.config.publisherRoles;
    return this.hasOverlap(publisherRoles, timestampInfo.timestampDefinitionTO.publisherPattern.map(x => x.publisherRole)) &&
      // Special-case: If we are both the sender *and* the primary receiver, then we count this as an "ingoing"
      // timestamp.  This makes it easier to add all roles for local testing and still see the "accept/reject"
      // buttons.
      //
      // If you are here because you want to double check the "secondary timestamp" flow, just remove
      // the relevant roles from "publisherRoles" from config.json. :)
      !this.isPrimaryReceiver(timestampInfo);
  }

  showComment(timestampInfo: TimestampInfo) {
    const delayCode = this.delayCodes.find((delayCode) => delayCode.smdgCode == timestampInfo.operationsEventTO.delayReasonCode, null);
    this.dialogService.open(TimestampCommentDialogComponent, {
      header: this.translate.instant('general.comment.header'),
      width: '50%', data: { timestampInfo: timestampInfo, delayCode: delayCode }
    }).onClose.subscribe((_) => {
    });
  }

  openCreationDialog() {
    const timestampEditor = this.dialogService.open(TimestampEditorComponent, {
      header: this.translate.instant('general.timestamp.create.label'),
      width: '75%',
      data: {
        transportCall: this.transportCallSelected,
        timestampResponseStatus: TimestampResponseStatus.CREATE
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
    // Avoid cloning the remark and delayReasonCode from the original sender.  It would just be confusing to them
    // so see their own comment in a reply to them.
    timestampShallowClone.remark = null;
    timestampShallowClone.delayReasonCode = null;
    const timestampEditor = this.dialogService.open(TimestampEditorComponent, {
      header: this.translate.instant('general.timestamp.accept.label'),
      width: '75%',
      data: {
        transportCall: this.transportCallSelected,
        responseTimestampDefinitionTO: timestamp.timestampDefinitionTO.acceptTimestampDefinitionEntity,
        respondingToTimestamp: timestampShallowClone,
        timestampResponseStatus: TimestampResponseStatus.ACCEPT
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
    // Avoid cloning the remark and delayReasonCode from the original sender.  It would just be confusing to them
    // so see their own comment in a reply to them.
    timestampShallowClone.remark = null;
    timestampShallowClone.delayReasonCode = null;
    const timestampEditor = this.dialogService.open(TimestampEditorComponent, {
      header: this.translate.instant('general.timestamp.reject.label'),
      width: '75%',
      data: {
        transportCall: this.transportCallSelected,
        responseTimestampDefinitionTO: timestamp.timestampDefinitionTO.rejectTimestampDefinitionEntity,
        respondingToTimestamp: timestampShallowClone,
        timestampResponseStatus: TimestampResponseStatus.REJECT
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
  private colorizetimestampByLocation(timestampInfos: TimestampInfo[]) {
    let colourPalette: string[] = new Array("#30a584", "#f5634a", "#d00fc2", "#fad089", "#78b0ee", "#19ee79", "#d0a9ff", "#ff9d00", "#b03e3e", "#0400ff")

    let portaproaches = new Map();
    // extract processIDs
    timestampInfos.forEach(function (timestampInfo) {
      portaproaches.set(timestampInfo.operationsEventTO.facilityTypeCode, null);
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
    timestampInfos.forEach(function (timestampInfo) {
      timestampInfo.sequenceColor = portaproaches.get(timestampInfo.operationsEventTO.facilityTypeCode);
    });

  }


  filterSelected() {
    this.refreshTimestamps()
  }
}


