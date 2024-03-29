import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Port} from '../../model/portCall/port';
import {DelayCodeService} from '../../controller/services/base/delay-code.service';
import {TimestampCommentDialogComponent} from '../timestamp-comment-dialog/timestamp-comment-dialog.component';
import {DelayCode} from '../../model/portCall/delayCode';
import {DialogService} from 'primeng/dynamicdialog';
import {filter, mergeMap, shareReplay, take, tap, toArray} from 'rxjs/operators';
import {VesselService} from '../../controller/services/base/vessel.service';
import {TranslateService} from '@ngx-translate/core';
import {TransportCall} from '../../model/jit/transport-call';
import {TimestampEditorComponent} from '../timestamp-editor/timestamp-editor.component';
import {Globals} from '../../model/portCall/globals';
import {TimestampMappingService} from '../../controller/services/mapping/timestamp-mapping.service';
import {Timestamp} from 'src/app/model/jit/timestamp';
import {NegotiationCycle} from '../../model/portCall/negotiation-cycle';
import {TimestampInfo} from '../../model/jit/timestamp-info';
import {PublisherRole} from '../../model/enums/publisherRole';
import {Terminal} from '../../model/portCall/terminal';
import {TerminalService} from '../../controller/services/base/terminal.service';
import {TimestampResponseStatus} from 'src/app/model/enums/timestamp-response-status';
import {TimestampDefinitionService} from 'src/app/controller/services/base/timestamp-definition.service';
import {BehaviorSubject, combineLatest, from, Observable} from 'rxjs';
import {PortCallPart} from '../../model/portCall/port-call-part';

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
  timestampInfos$: Observable<TimestampInfo[]>;
  terminals$: Observable<Terminal[]>;
  negotiationCycles$: Observable<NegotiationCycle[]>;
  filterTerminal$ = new BehaviorSubject<Terminal | null>(null);
  delayCodes: DelayCode[] = [];
  portOfCall: Port;
  portCallParts$: Observable<PortCallPart[]>;
  selectedPortCallPart: PortCallPart = null;
  filterPortCallPart$ = new BehaviorSubject<PortCallPart | null>(null);
  filterNegotiationCycle$ = new BehaviorSubject<NegotiationCycle | null>(null);

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
    this.delayCodeService.getDelayCodes().pipe(take(1)).subscribe(delayCodes => this.delayCodes = delayCodes);
    this.portCallParts$ = this.timestampDefinitionService.getPortCallParts();
    this.negotiationCycles$ = this.timestampDefinitionService.getNegotiationCycles();
    this.loadTimestamps();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.loadTimestamps();
    if (this.transportCallSelected) {
      this.terminals$ = this.terminalService.getTerminalsByUNLocationCode(this.transportCallSelected.UNLocationCode, true);
    }
  }


  public isPrimaryReceiver(timestampInfo: TimestampInfo): boolean {
    return this.hasOverlap(
      this.globals.config.publisherRoles,
      timestampInfo.timestampDefinitionTO.publisherPattern.map(x => x.primaryReceiver)
    );
  }

  private loadTimestamps(): void {
    if (this.transportCallSelected) {
      this.timestampInfos$ = combineLatest([
          this.filterTerminal$,
          this.filterNegotiationCycle$,
          this.filterPortCallPart$,
          this.vesselService.vesselChanged$,
      ]).pipe(
        mergeMap(([
                    filterTerminal,
                    filterNegotiationCycle,
                    portCallPart,
                    _vesselChangeTrigger,  // Unused; a trigger for reloading on vessel change
        ]) => {
          return this.timestampMappingService.getPortCallTimestampsByTransportCall(
            this.transportCallSelected,
            filterTerminal,
            filterNegotiationCycle?.cycleKey,
          ).pipe(
            // Port Call Part is a bit annoying because we have to flatten, filter and then recreate the list
            mergeMap(timestampInfos => from(timestampInfos)),
            filter(timestampInfo => !portCallPart || portCallPart.portCallPart === timestampInfo.timestampDefinitionTO.portCallPart),
            toArray(),
          );
        }),
        tap(timestampInfos => this.colorizeTimestampByLocation(timestampInfos)),
        tap(timestampInfos => {
          timestampInfos.forEach(timestampInfo => {
            timestampInfo.operationsEventTO.transportCall.vessel = this.transportCallSelected.vessel;
          });
        }),
        tap(timestampInfos => this.colorizeTimestampByLocation(timestampInfos)),
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );
    }
  }

  refreshTimestamps(): void {
    this.loadTimestamps();
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
      && a.operationsEventTO.operationsEventTypeCode !== 'OMIT';
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

  showComment(timestampInfo: TimestampInfo): void {
    const delayCode = this.delayCodes.find((delayCode) => delayCode.smdgCode == timestampInfo.operationsEventTO.delayReasonCode, null);
    this.dialogService.open(TimestampCommentDialogComponent, {
      header: this.translate.instant('general.comment.header'),
      width: '50%', data: { timestampInfo: timestampInfo, delayCode: delayCode }
    }).onClose.pipe(take(1)).subscribe();
  }

  openCreationDialog(): void {
    const timestampEditor = this.dialogService.open(TimestampEditorComponent, {
      header: this.translate.instant('general.timestamp.create.label'),
      width: '75%',
      data: {
        transportCall: this.transportCallSelected,
        timestampResponseStatus: TimestampResponseStatus.CREATE
      }
    });
    // This will in directly trigger a refresh if necessary via the transport-call-table reloading the transport call.
    timestampEditor.onClose.pipe(take(1)).subscribe();
  }

  openAcceptDialog(timestamp: Timestamp): void {
    const timestampShallowClone = Object.assign({}, timestamp);
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
    // This will in directly trigger a refresh if necessary via the transport-call-table reloading the transport call.
    timestampEditor.onClose.pipe(take(1)).subscribe();
  }

  openRejectDialog(timestamp: Timestamp): void {
    const timestampShallowClone = Object.assign({}, timestamp);
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
    // This will in directly trigger a refresh if necessary via the transport-call-table reloading the transport call.
    timestampEditor.onClose.pipe(take(1)).subscribe();
  }

  /*
    Function that will colorize
    //@ToDo Move this function to postProcessing in timestampService
   */
  private colorizeTimestampByLocation(timestampInfos: TimestampInfo[]): void {
    const colourPalette: string[] = ['#30a584', '#f5634a', '#d00fc2', '#fad089',
                                     '#78b0ee', '#19ee79', '#d0a9ff', '#ff9d00',
                                     '#b03e3e', '#0400ff',
    ];

    const portApproaches = new Map<string, string>();
    // extract processIDs
    timestampInfos.forEach((timestampInfo) => {
      portApproaches.set(timestampInfo.operationsEventTO.facilityTypeCode, null);
    });
    let i = 0;
    // assign color to portApproaches
    for (const key of portApproaches.keys()) {
      portApproaches.set(key, colourPalette[i]);
      i++;
      if (i === colourPalette.length) {
        i = 0;
      }
    }
    // assign color to timestamp
    timestampInfos.forEach((timestampInfo) => {
      timestampInfo.sequenceColor = portApproaches.get(timestampInfo.operationsEventTO.facilityTypeCode);
    });

  }

  filterNegotiationCycleChange(event: any): void {
    this.filterNegotiationCycle$.next(event.value as NegotiationCycle);
  }

  filterTerminalChange(event: any): void {
    this.filterTerminal$.next(event.value as Terminal);
  }

  filterPortCallPartChange(event: any): void {
    this.filterPortCallPart$.next(event.value as PortCallPart);
  }
}


