import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {PortcallTimestamp} from "../../model/portCall/portcall-timestamp";
import {PortcallTimestampService} from "../../controller/services/base/portcall-timestamp.service";
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
import {Transport} from "../../model/OVS/transport";
import {TimestampMappingService} from "../../controller/services/mapping/timestamp-mapping.service";
import {Util} from "../../controller/services/util/util";


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
  @Input('TransportCallSelected') transportCallSelected: Transport;

  @Output('timeStampAddedNotifier') timeStampAddedNotifier: EventEmitter<PortcallTimestamp> = new EventEmitter<PortcallTimestamp>()

  timestamps: PortcallTimestamp[];
  logOfTimestampDate: Date;
  logOfTimestampTime: String;
  eventTimestampDate: Date;
  eventTimestampTime: String;
  timestampSelected: string;
  creationProgress: boolean = false;

  transport: Transport;
  delayCode: DelayCode;

  timestampTypes: SelectItem[] = [];
  delayCodeOptions: SelectItem[] = [];
  delayCodes: DelayCode[] = [];


  defaultTimestamp: PortcallTimestamp = {
    locationType: "",
    callSequence: 0,
    changeComment: "",
    classifierCode: "",
    delayCode: undefined,
    direction: "",
    eventTimestamp: undefined,
    eventTypeCode: "",
    id: "",
    locationId: "",
    logOfTimestamp: undefined,
    modifiable: false,
    portNext: undefined,
    portOfCall: undefined,
    portPrevious: undefined,
    response: undefined,
    terminal: undefined,
    timestampType: undefined,
    transportCallID: "",
    vessel: undefined

  };

  constructor(private portcallTimestampService: PortcallTimestampService,
              private portIdToPortPipe: PortIdToPortPipe,
              private messageService: MessageService,
              private delayCodeService: DelayCodeService,
              private portCallTimestampTypePipe: PortCallTimestampTypeToStringPipe,
              private dialogService: DialogService,
              public config: DynamicDialogConfig,
              private translate: TranslateService,
              public ref: DynamicDialogRef,
              private timestampMappingService: TimestampMappingService) {
  }

  ngOnInit(): void {
    this.delayCodeService.getDelayCodes().subscribe(delayCodes => {
      this.delayCodes = delayCodes;
      this.updateDelayCodeOptions()});
    this.timestamps = this.config.data.timestamps;
    this.transport = this.config.data.transportCall.dischargeTransportCall;
    this.generateDefaultTimestamp();
    this.timestampSelected = Util.GetEnumKeyByEnumValue(PortcallTimestampType, this.defaultTimestamp.timestampType);
    this.defaultTimestamp.timestampType;
    this.setLogOfTimestampToNow();
    this.updateTimestampTypeOptions();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateTimestampTypeOptions()
    });

  }

  ngOnChanges(changes: SimpleChanges): void {

  }


  savePortcallTimestamp(portcallTimestamp: PortcallTimestamp) {
    const dateToUtc = new DateToUtcPipe();

    portcallTimestamp.logOfTimestamp = this.logOfTimestampDate;
    let logOfTimestampTimeStrings = this.logOfTimestampTime.split(":");
    portcallTimestamp.logOfTimestamp.setHours(parseInt(logOfTimestampTimeStrings[0]), parseInt(logOfTimestampTimeStrings[1]));
    portcallTimestamp.eventTimestamp = this.eventTimestampDate;
    let eventTimestampTimeStrings = this.eventTimestampTime.split(":");
    portcallTimestamp.eventTimestamp.setHours(parseInt(eventTimestampTimeStrings[0]), parseInt(eventTimestampTimeStrings[1]));
    //@ToDo To UTC Converter!
    portcallTimestamp.logOfTimestamp = portcallTimestamp.logOfTimestamp
    portcallTimestamp.eventTimestamp = portcallTimestamp.eventTimestamp
    portcallTimestamp.timestampType = PortcallTimestampType[this.timestampSelected];
    portcallTimestamp.delayCode = (this.delayCode?this.delayCode.smdgCode:null);
    console.log("Save Timestamp:");
    console.log(portcallTimestamp);
    this.creationProgress = true;
    this.portcallTimestampService.addPortcallTimestamp(portcallTimestamp).subscribe(respTimestamp =>{
      this.creationProgress = false;
      this.messageService.add(
        {key: 'TimestampAddSuccess',
          severity:'success',
          summary: this.translate.instant('general.save.editor.success.summary'),
          detail: this.translate.instant('general.save.editor.success.detail')})
        this.ref.close(respTimestamp);
    },
    error => {
      this.messageService.add(
        {key: 'TimestampAddError',
          severity:'error',
          summary: this.translate.instant('general.save.editor.failure.summary'),
          detail: this.translate.instant('general.save.editor.failure.detail')+ error.message})
      this.creationProgress = false;
    })


  }

  updateDelayCodeOptions() {
    this.delayCodeOptions = [];
    this.delayCodeOptions.push({label: this.translate.instant('general.comment.select'), value: null});
    this.delayCodes.forEach(delayCode => {
      this.delayCodeOptions.push({label: delayCode.smdgCode, value: delayCode})
    });
  }

  updateTimestampTypeOptions() {
    this.timestampTypes = [];
    this.timestampTypes.push({label: this.translate.instant('general.timestamp.select'), value: null});
    for (let item in PortcallTimestampType) {
      this.timestampTypes.push({label: PortcallTimestampType[item], value: item})
    }
  }

  close() {
    this.ref.close(null);
  }

  validatePortOfCallTimestamp(timestamp: PortcallTimestamp): boolean {
    return !(timestamp.timestampType &&
      this.logOfTimestampDate && this.logOfTimestampTime &&
      this.eventTimestampDate && this.eventTimestampTime &&
      timestamp.direction &&
      timestamp.portNext &&
      timestamp.portPrevious &&
      timestamp.portOfCall &&
      timestamp.terminal);
  }

  setLogOfTimestampToNow() {
    this.logOfTimestampDate = new Date();
    this.logOfTimestampTime = this.leftPadWithZero(this.logOfTimestampDate.getHours()) + ":" + this.leftPadWithZero(this.logOfTimestampDate.getMinutes());
  }


  setEventTimestampToNow() {
    this.eventTimestampDate = new Date();
    this.eventTimestampTime = this.leftPadWithZero(this.eventTimestampDate.getHours()) + ":" + this.leftPadWithZero(this.eventTimestampDate.getMinutes());
  }

  setEventTimestampToDate(eventDate: Date) {
    this.eventTimestampDate = eventDate;
    this.eventTimestampTime = this.leftPadWithZero(this.eventTimestampDate.getHours()) + ":" + this.leftPadWithZero(this.eventTimestampDate.getMinutes());
  }

  leftPadWithZero(item: number): String {
    return (String('0').repeat(2) + item).substr((2 * -1), 2);
  }

  private generateDefaultTimestamp() {
    this.defaultTimestamp.logOfTimestamp = new Date();
    this.defaultTimestamp.transportCallID = this.transport.dischargeTransportCall.transportCallID;
    this.defaultTimestamp.portOfCall =  this.timestampMappingService.getPortByUnLocode(this.transport.dischargeTransportCall.UNLocationCode);
    this.defaultTimestamp.terminal = this.timestampMappingService.getTerminalByFacilityCode(this.transport.dischargeTransportCall.facilityCode)



    if (this.timestamps.length == 0) {
      // Generate Initial ETA Berth
      this.defaultTimestamp.timestampType = PortcallTimestampType.ETA_Berth;
         } else {

      // Check for last timestamp and generate based on this
      let lastTimestamp = this.getLatestTimestamp();
      this.defaultTimestamp.vessel = lastTimestamp.vessel;
      this.defaultTimestamp.timestampType = lastTimestamp.timestampType;
      this.defaultTimestamp.terminal = lastTimestamp.terminal;
      this.defaultTimestamp.eventTimestamp = lastTimestamp.eventTimestamp;
      this.defaultTimestamp.locationId = lastTimestamp.locationId;


      // Set eventDateTime if required
      this.defaultTimestamp.eventTimestamp = lastTimestamp.eventTimestamp;
      this.setEventTimestampToDate(new Date(lastTimestamp.eventTimestamp));
    }

    console.log(this.defaultTimestamp);


  }

  private getLatestTimestamp(): PortcallTimestamp {
    let latestTimestamp = this.timestamps[0];
    this.timestamps.forEach(function (timestamp) {
      if (timestamp.logOfTimestamp > latestTimestamp.logOfTimestamp) {
        latestTimestamp = timestamp;
      }
    });
    return latestTimestamp;
  }

}
