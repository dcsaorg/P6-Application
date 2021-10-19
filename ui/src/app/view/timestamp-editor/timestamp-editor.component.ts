import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MessageService, SelectItem} from "primeng/api";
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {PortCallTimestampTypeToStringPipe} from "../../controller/pipes/port-call-timestamp-type-to-string.pipe";
import {Port} from "../../model/portCall/port";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {DelayCode} from "../../model/portCall/delayCode";
import {DateToUtcPipe} from "../../controller/pipes/date-to-utc.pipe";
import {DelayCodeService} from "../../controller/services/base/delay-code.service";
import {VesselIdToVesselPipe} from "../../controller/pipes/vesselid-to-vessel.pipe";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {TransportCall} from "../../model/ovs/transport-call";
import {TimestampMappingService} from "../../controller/services/mapping/timestamp-mapping.service";
import {Timestamp} from "../../model/ovs/timestamp";
import {Globals} from "../../model/portCall/globals";
import {EventLocation} from "../../model/eventLocation";
import { take } from 'rxjs/operators';
import { PortService } from 'src/app/controller/services/base/port.service';
import {VesselPosition} from "../../model/vesselPosition";
import { Terminal } from 'src/app/model/portCall/terminal';
import { TerminalService } from 'src/app/controller/services/base/terminal.service';


@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss'],
  providers: [
    PortCallTimestampTypeToStringPipe,
    DialogService,
    VesselIdToVesselPipe
  ]
})
export class TimestampEditorComponent implements OnInit, OnChanges {
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
  timestampSelected: string;
  creationProgress: boolean = false;
  locationNameLabel: string;
  locationName: string;
  ports: Port[] = [];
  vesselPosition: VesselPosition = new class implements VesselPosition {
    latitude: string;
    longitude: string;
  }
  transportCall: TransportCall;
  timestampTypes: SelectItem[] = [];
  timestampType: PortcallTimestampType;
  delayCodeOptions: SelectItem[] = [];
  delayCodes: DelayCode[];
  delayCode: DelayCode;
  respondingToTimestamp: Timestamp;
  terminalOptions: SelectItem[] = [];
  terminalSelected: Terminal;

  defaultTimestamp: Timestamp = {
    publisher: undefined,
    publisherRole: undefined,
    vesselIMONumber: undefined,
    UNLocationCode: undefined,
    facilityCode: undefined,
    facilityTypeCode: undefined,
    eventClassifierCode: undefined,
    operationsEventTypeCode: undefined,
    eventDateTime: undefined,
    modifiable: false,
    portNext: undefined,
    portOfCall: undefined,
    portPrevious: undefined,
    timestampType: undefined,
    transportCallID: ""
  };
  

  constructor(
              private messageService: MessageService,
              private delayCodeService: DelayCodeService,
              private globals: Globals,
              public config: DynamicDialogConfig,
              private translate: TranslateService,
              public ref: DynamicDialogRef,
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
    this.generateDefaultTimestamp();
    this.defaultTimestamp.timestampType;
    this.updateTimestampTypeOptions();
    this.updateTerminalOptions(this.transportCall.UNLocationCode);

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateTimestampTypeOptions()
    });

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  hideVesselPosition(): boolean {
    if (!this.globals.config.enableVesselPositions) return true;
    if (this.globals.config.enableJIT11Timestamps) {
      switch (this.timestampSelected) {
        case PortcallTimestampType.ETA_Berth:
        case PortcallTimestampType.PTA_Berth:
        case PortcallTimestampType.ETA_PBP:
        case PortcallTimestampType.PTA_PBP:
        case PortcallTimestampType.EOSP:
        case PortcallTimestampType.ATS_Pilotage:
        case PortcallTimestampType.ATS_Towage:
        case PortcallTimestampType.ATC_Pilotage:
        case PortcallTimestampType.SOSP:
          return false;
        default:
          return true;
      }
    }
    else {
      switch (this.timestampSelected) {
        case PortcallTimestampType.ETA_Berth:
        case PortcallTimestampType.PTA_Berth:
        case PortcallTimestampType.ETA_PBP:
        case PortcallTimestampType.PTA_PBP:
        case PortcallTimestampType.ATS_Pilotage:
          return false;
        default:
          return true;
      }
    }
  }

  showLocationNameOption(): boolean {
    const timestampType = this.timestampSelected as PortcallTimestampType;
    this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(timestampType);
    return this.locationNameLabel !== undefined;
  }

  HideTerminalOption(): boolean {
    const timestampType = this.timestampSelected as PortcallTimestampType;
    return this.timestampMappingService.HideTerminalOptions(timestampType);
  }

  savePortcallTimestamp(timestamp: Timestamp, transportCall: TransportCall) {

    timestamp.UNLocationCode = transportCall.UNLocationCode;
    timestamp.facilitySMDGCode = transportCall.facilityCode;
    timestamp.facilityTypeCode = transportCall.facilityTypeCode;
    timestamp.carrierServiceCode = transportCall.carrierServiceCode;
    timestamp.carrierVoyageNumber = transportCall.carrierVoyageNumber
    timestamp.publisher = this.globals.config.publisher;
    timestamp.publisherRole = this.globals.config.publisherRole;
    timestamp.delayReasonCode = (this.delayCode ? this.delayCode.smdgCode : null);
    timestamp.timestampType = this.timestampSelected as PortcallTimestampType;

    timestamp.facilitySMDGCode = (this.terminalSelected?.facilitySMDGCode ? this.terminalSelected?.facilitySMDGCode : null);

    if (this.eventTimestampDate) {
      timestamp.eventDateTime = new DateToUtcPipe().transform(this.eventTimestampDate, this.eventTimestampTime, this.transportCall.portOfCall?.timezone);
    }

    if (this.locationNameLabel && this.locationName) {
      timestamp.eventLocation = new class implements EventLocation {
        locationName: string
      }
      timestamp.eventLocation.locationName = this.locationName;
    }

    const latitude = this.vesselPosition.latitude;
    const longtitude = this.vesselPosition.longitude;
    if (latitude && longtitude) {
      timestamp.vesselPosition = new class implements VesselPosition {
        latitude: string = latitude;
        longitude: string = longtitude;
      }
    }

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

  private updateTimestampTypeOptions() {
    this.timestampTypes = [];
    this.timestampTypes.push({label: this.translate.instant('general.timestamp.select'), value: null});
    for (let item of this.timestampMappingService.getPortcallTimestampTypes(this.globals.config.publisherRole, this.globals.config.enableJIT11Timestamps)) {
      this.timestampTypes.push({label: item, value: item})
    }
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
      this.terminalOptions.push({label: this.translate.instant('general.terminal.select'), value: null});
      terminals.forEach(terminal => {
          this.terminalOptions.push({label: terminal.facilitySMDGCode, value: terminal})
      });
    })
  }
  close() {
    this.ref.close(null);
  }

  validatePortOfCallTimestamp(): boolean {
    return !(
      this.timestampSelected && this.eventTimestampDate && this.eventTimestampTime
    );
  }

  private setLogOfTimestampToNow() {
    this.logOfTimestampDate = new Date();
    this.logOfTimestampTime = this.leftPadWithZero(this.logOfTimestampDate.getHours()) + ":" + this.leftPadWithZero(this.logOfTimestampDate.getMinutes());
  }


  setEventTimestampToNow() {
    let eventTimestampDat = new Date();
    this.eventTimestampTime = this.leftPadWithZero(eventTimestampDat.getHours()) + ":" + this.leftPadWithZero(eventTimestampDat.getMinutes());
  }

  //this functions sets both time and date!
  /* setEventTimestampToNow() {
    this.eventTimestampDate = new Date();
    this.eventTimestampTime = this.leftPadWithZero(this.eventTimestampDate.getHours()) + ":" + this.leftPadWithZero(this.eventTimestampDate.getMinutes());
  } */

  /*
    setEventTimestampToDate(eventDate: Date) {
      this.eventTimestampDate = eventDate;
      this.eventTimestampTime = this.leftPadWithZero(this.eventTimestampDate.getHours()) + ":" + this.leftPadWithZero(this.eventTimestampDate.getMinutes());
    }
  */
  private leftPadWithZero(item: number): String {
    return (String('0').repeat(2) + item).substr((2 * -1), 2);
  }

  private async generateDefaultTimestamp() {
    this.defaultTimestamp.logOfTimestamp = new Date();
    this.defaultTimestamp.transportCallID = this.transportCall.transportCallID;
    this.defaultTimestamp.portOfCall = this.transportCall.portOfCall;
    this.defaultTimestamp.vesselIMONumber = this.transportCall.vesselIMONumber;
    this.defaultTimestamp.UNLocationCode = this.transportCall.UNLocationCode;
    // Set publisher based on globals
    this.defaultTimestamp.publisherRole = this.globals.config.publisherRole;
    this.defaultTimestamp.publisher = this.globals.config.publisher;
  }
}