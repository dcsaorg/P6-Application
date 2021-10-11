import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MessageService, SelectItem} from "primeng/api";
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {PortIdToPortPipe} from "../../controller/pipes/port-id-to-port.pipe";
import {PortCallTimestampTypeToStringPipe} from "../../controller/pipes/port-call-timestamp-type-to-string.pipe";
import {Port} from "../../model/portCall/port";
import {TerminalIdToTerminalPipe} from "../../controller/pipes/terminal-id-to-terminal.pipe";
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

@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss'],
  providers: [
    PortIdToPortPipe,
    PortCallTimestampTypeToStringPipe,
    TerminalIdToTerminalPipe,
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

  transportCall: TransportCall;

  timestampTypes: SelectItem[] = [];
  timestampType: PortcallTimestampType;
  delayCodeOptions: SelectItem[] = [];
  delayCodes: DelayCode[];
  delayCode: DelayCode;

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
              private portIdToPortPipe: PortIdToPortPipe,
              private messageService: MessageService,
              private delayCodeService: DelayCodeService,
              private globals: Globals,
              public config: DynamicDialogConfig,
              private translate: TranslateService,
              public ref: DynamicDialogRef,
              private timestampMappingService: TimestampMappingService) {}

  ngOnInit(): void {
    this.delayCodeService.getDelayCodes().subscribe(delayCodes => {
      this.delayCodes = delayCodes;
      this.updateDelayCodeOptions()
    });
    this.timestamps = this.config.data.timestamps;
    this.transportCall = this.config.data.transportCall;
    this.generateDefaultTimestamp();
    this.defaultTimestamp.timestampType;
    this.updateTimestampTypeOptions();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateTimestampTypeOptions()
    });

  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  showLocationNameOption(): boolean {
    const timestampType = this.timestampSelected as PortcallTimestampType;
    this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(timestampType);
    return this.locationNameLabel !== undefined;
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

    if (this.eventTimestampDate) {
      let port = this.timestampMappingService.getPortByUnLocode(transportCall.UNLocationCode);
      timestamp.eventDateTime = new DateToUtcPipe().transform(this.eventTimestampDate, this.eventTimestampTime, port);
    }

    if (this.locationNameLabel && this.locationName) {
      timestamp.eventLocation = new class implements EventLocation {
        locationName: string
      }
      timestamp.eventLocation.locationName = this.locationName;
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

  updateTimestampTypeOptions() {
    this.timestampTypes = [];
    this.timestampTypes.push({label: this.translate.instant('general.timestamp.select'), value: null});
    for (let item of this.timestampMappingService.getPortcallTimestampTypes(this.globals.config.publisherRole, this.globals.config.enableJIT11Timestamps)) {
      this.timestampTypes.push({label: item, value: item})
    }
  }

  updateDelayCodeOptions() {
    this.delayCodeOptions = [];
    this.delayCodeOptions.push({label: this.translate.instant('general.comment.select'), value: null});
    this.delayCodes.forEach(delayCode => {
      this.delayCodeOptions.push({label: delayCode.smdgCode, value: delayCode})
    });
  }

  close() {
    this.ref.close(null);
  }

  validatePortOfCallTimestamp(): boolean {
    return !(
      this.timestampSelected && this.eventTimestampDate && this.eventTimestampTime
    );
  }

  setLogOfTimestampToNow() {
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
  leftPadWithZero(item: number): String {
    return (String('0').repeat(2) + item).substr((2 * -1), 2);
  }

  private generateDefaultTimestamp() {
    this.defaultTimestamp.logOfTimestamp = new Date();
    this.defaultTimestamp.transportCallID = this.transportCall.transportCallID;
    this.defaultTimestamp.portOfCall = this.timestampMappingService.getPortByUnLocode(this.transportCall.UNLocationCode);
    this.defaultTimestamp.vesselIMONumber = this.transportCall.vesselIMONumber;
    this.defaultTimestamp.facilityCode = this.transportCall.facilityCode;
    // Set publisher based on globals
    this.defaultTimestamp.publisher = this.globals.config.publisher;
    this.defaultTimestamp.publisherRole = this.globals.config.publisherRole;

    if (this.timestamps.length == 0) {
      // Generate Initial ETA Berth
      this.defaultTimestamp.timestampType = PortcallTimestampType.ETA_Berth;
    } else {

      // Check for last timestamp and generate based on this
      let lastTimestamp = this.getLatestTimestamp();

      // Set eventDateTime if required
      this.defaultTimestamp.eventDateTime = lastTimestamp.eventDateTime;

      this.defaultTimestamp.UNLocationCode = this.transportCall.UNLocationCode;


    }

  }

  private getLatestTimestamp(): Timestamp {
    let latestTimestamp = this.timestamps[0];
    this.timestamps.forEach(function (timestamp) {
      if (timestamp.logOfTimestamp > latestTimestamp.logOfTimestamp) {
        latestTimestamp = timestamp;
      }
    });
    return latestTimestamp;
  }

}
