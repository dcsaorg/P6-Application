import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MessageService, SelectItem} from "primeng/api";
import {Port} from "../../model/portCall/port";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DelayCode} from "../../model/portCall/delayCode";
import {DateToUtcPipe} from "../../controller/pipes/date-to-utc.pipe";
import {DelayCodeService} from "../../controller/services/base/delay-code.service";
import {VesselIdToVesselPipe} from "../../controller/pipes/vesselid-to-vessel.pipe";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {TransportCall} from "../../model/jit/transport-call";
import {TimestampMappingService} from "../../controller/services/mapping/timestamp-mapping.service";
import {Timestamp} from "../../model/jit/timestamp";
import {Globals} from "../../model/portCall/globals";
import {EventLocation} from "../../model/eventLocation";
import {VesselPosition} from "../../model/vesselPosition";
import {Terminal} from 'src/app/model/portCall/terminal';
import {TerminalService} from 'src/app/controller/services/base/terminal.service';
import {TimestampDefinitionService} from "../../controller/services/base/timestamp-definition.service";
import {TimestampDefinition} from "../../model/jit/timestamp-definition";
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-timestamp-accept-editor',
  templateUrl: './timestamp-accept-editor.component.html',
  styleUrls: ['./timestamp-accept-editor.component.scss'],
  providers: [
    DialogService,
    VesselIdToVesselPipe
  ]
})
export class TimestampAcceptEditorComponent implements OnInit, OnChanges {
  @Input('vesselId') vesselId: number;
  @Input('vesselSavedId') vesselSavedId: number;
  @Input('portOfCall') portOfCall: Port;
  @Input('TransportCallSelected') transportCallSelected: TransportCall;

  @Output('timeStampAddedNotifier') timeStampAddedNotifier: EventEmitter<Timestamp> = new EventEmitter<Timestamp>()

  timestamps: Timestamp[];
  logOfTimestampDate: Date;
  logOfTimestampTime: String;
  eventTimestampDate: Date;
  eventTimestampTime: string;
  timestampSelected: TimestampDefinition;
  creationProgress: boolean = false;
  locationNameLabel: string;
  locationName: string;
  ports: Port[] = [];
  vesselPosition: VesselPosition = new class implements VesselPosition {
    latitude: string;
    longitude: string;
  }
  transportCall: TransportCall;
  timestampDefinitions: TimestampDefinition[] = [];
  timestampTypes: SelectItem[] = [];
  delayCodeOptions: SelectItem[] = [];
  delayCodes: DelayCode[];
  delayCode: DelayCode;
  respondingToTimestamp: Timestamp;
  terminalOptions: SelectItem[] = [];
  terminalSelected: Terminal;


  constructor(
              private messageService: MessageService,
              private delayCodeService: DelayCodeService,
              private globals: Globals,
              public config: DynamicDialogConfig,
              private translate: TranslateService,
              public ref: DynamicDialogRef,
              private timestampDefinitionService: TimestampDefinitionService,
              private timestampMappingService: TimestampMappingService,
              private terminalService: TerminalService) {
  }

  ngOnInit(): void {
    this.delayCodeService.getDelayCodes().subscribe(delayCodes => {
      this.delayCodes = delayCodes;
      this.updateDelayCodeOptions()
    });
    this.timestamps = this.config.data.timestamps;
    this.transportCall = this.config.data.transportCall;
    this.respondingToTimestamp = this.config.data.respondingToTimestamp;
    this.ports = this.config.data.ports;
    this.updateTerminalOptions(this.transportCall.UNLocationCode);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  showVesselPosition(): boolean {
    if (!this.globals.config.enableVesselPositions) return false;
    return this.respondingToTimestamp.timestampDefinition.isVesselPositionNeeded ?? false;
  }

  showLocationNameOption(): boolean {
    this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(this.respondingToTimestamp.timestampDefinition);
    return this.locationNameLabel !== undefined;
  }

  showTerminalOption(): boolean {
    return this.respondingToTimestamp.timestampDefinition.isTerminalNeeded ?? false;
  }

  savePortcallTimestamp(timestamp: Timestamp, transportCall: TransportCall) {

    // Set delay code if specified
    timestamp.delayReasonCode = (this.delayCode ? this.delayCode.smdgCode : null);
    // set terminal if specified
    timestamp.facilitySMDGCode = (this.terminalSelected?.facilitySMDGCode ? this.terminalSelected?.facilitySMDGCode : null);

    // set location if specified
    if (this.locationNameLabel && this.locationName) {
      timestamp.eventLocation = new class implements EventLocation {
        locationName: string
      }
      timestamp.eventLocation.locationName = this.locationName;
    }

    // set vessel position if specified
    const latitude = this.vesselPosition.latitude;
    const longtitude = this.vesselPosition.longitude;
    if (latitude && longtitude) {
      timestamp.vesselPosition = new class implements VesselPosition {
        latitude: string = latitude;
        longitude: string = longtitude;
      }
    }

    // Post timestamp 
    this.creationProgress = true;
    this.timestampMappingService.addPortCallTimestamp(timestamp).subscribe(() => {
        this.creationProgress = false;
        this.messageService.add(
          {
            key: 'TimestampAddSuccess',
            severity: 'success',
            summary: this.translate.instant('general.save.editor.success.summary'),
            detail: this.translate.instant('general.save.editor.success.detail')
          })
        this.ref.close(timestamp);
      },
      error => {
        this.messageService.add(
          {
            key: 'TimestampAddError',
            severity: 'error',
            summary: this.translate.instant('general.save.editor.failure.summary'),
            detail: this.translate.instant('general.save.editor.failure.detail') + error.message
          })
        this.creationProgress = false;
      })
  }


  private updateDelayCodeOptions() {
    this.delayCodeOptions = [];
    this.delayCodeOptions.push({label: this.translate.instant('general.comment.select'), value: null});
    this.delayCodes.forEach(delayCode => {
      this.delayCodeOptions.push({label: delayCode.smdgCode, value: delayCode})
    });
  }

  private updateTerminalOptions(unLocationCode:string) {
    this.terminalService.getTerminalsByUNLocationCode(unLocationCode).subscribe(terminals => {
      this.globals.terminals = terminals;
      this.terminalOptions = [];
      this.terminalSelected = terminals.find(terminal => terminal.facilitySMDGCode == this.respondingToTimestamp.facilitySMDGCode);
      this.terminalOptions.push({label: this.translate.instant('general.terminal.select'), value: null});
      terminals.forEach(terminal => {
          this.terminalOptions.push({label: terminal.facilitySMDGCode, value: terminal})
      });
    })
  }

  close() {
    this.ref.close(null);
  }

}
