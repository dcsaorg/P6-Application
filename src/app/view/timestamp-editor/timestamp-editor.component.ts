import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService, SelectItem } from "primeng/api";
import { Port } from "../../model/portCall/port";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { DelayCode } from "../../model/portCall/delayCode";
import { DateToUtcPipe } from "../../controller/pipes/date-to-utc.pipe";
import { DelayCodeService } from "../../controller/services/base/delay-code.service";
import { VesselIdToVesselPipe } from "../../controller/pipes/vesselid-to-vessel.pipe";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { TransportCall } from "../../model/jit/transport-call";
import { TimestampMappingService } from "../../controller/services/mapping/timestamp-mapping.service";
import { Timestamp } from "../../model/jit/timestamp";
import { Globals } from "../../model/portCall/globals";
import { EventLocation } from "../../model/eventLocation";
import { VesselPosition } from "../../model/vesselPosition";
import { Terminal } from 'src/app/model/portCall/terminal';
import { TerminalService } from 'src/app/controller/services/base/terminal.service';
import { TimestampDefinitionService } from "../../controller/services/base/timestamp-definition.service";
import { TimestampDefinitionTO } from "../../model/jit/timestamp-definition";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss'],
  providers: [
    DialogService,
    VesselIdToVesselPipe
  ]
})
export class TimestampEditorComponent implements OnInit {
  @Input('vesselId') vesselId: number;
  @Input('vesselSavedId') vesselSavedId: number;
  @Input('portOfCall') portOfCall: Port;
  @Input('TransportCallSelected') transportCallSelected: TransportCall;

  @Output('timeStampAddedNotifier') timeStampAddedNotifier: EventEmitter<Timestamp> = new EventEmitter<Timestamp>()

  timestampFormGroup: FormGroup;
  timestamps: Timestamp[];
  eventTimestampDate: Date;
  eventTimestampTime: string;
  timestampTypeSelected: TimestampDefinitionTO;
  creationProgress: boolean = false;
  locationNameLabel: string;
  locationName: string;
  ports: Port[] = [];
  transportCall: TransportCall;
  timestampDefinitions: TimestampDefinitionTO[] = [];
  timestampTypes: SelectItem[] = [];
  delayCodeOptions: SelectItem[] = [];
  delayCodes: DelayCode[];
  delayCode: DelayCode;
  respondingToTimestamp: Timestamp;
  terminalOptions: SelectItem[] = [];
  terminalSelected: Terminal;
  milesToDestinationPort: string;

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
    timestampDefinitionTO: undefined,
    transportCallID: undefined,
    transportCallReference: undefined,
    carrierVoyageNumber: undefined
  };


  constructor(
    private formBuilder: FormBuilder,
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
    this.timestampDefinitionService.getTimestampDefinitions().subscribe(timestampDefinitions => {
      this.timestampDefinitions = timestampDefinitions;
      this.updateTimestampTypeOptions();
    })
    this.timestamps = this.config.data.timestamps;
    this.transportCall = this.config.data.transportCall;
    this.respondingToTimestamp = this.config.data.respondingToTimestamp;
    this.ports = this.config.data.ports;
    this.generateDefaultTimestamp();
    this.updateTerminalOptions(this.transportCall.portOfCall.UNLocationCode);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateTimestampTypeOptions();
    });
    this.timestampFormGroup = this.formBuilder.group({
      
      vesselPositionLongitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(11)]),
      vesselPositionLatitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(10)]),
      milesToDestinationPort: new FormControl(null, [Validators.pattern('^[0-9]+(.[0-9]{0,1})?$')]),

    });
  }

  showVesselPosition(): boolean {
    if (!this.globals.config.enableVesselPositions) return false;
    return this.timestampTypeSelected?.isVesselPositionNeeded ?? false;
  }

  showLocationNameOption(): boolean {
    this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(this.timestampTypeSelected);
    return this.locationNameLabel !== undefined;
  }

  showTerminalOption(): boolean {
    return this.timestampTypeSelected?.isTerminalNeeded ?? false;
  }

  showmilesToDestinationPortOption(): boolean {
    return this.timestampTypeSelected?.isMilesToDestinationRelevant ?? false;;
  }

  savePortcallTimestamp(timestamp: Timestamp) {

    timestamp.timestampDefinitionTO = this.timestampTypeSelected;
    timestamp.delayReasonCode = (this.delayCode ? this.delayCode.smdgCode : null);
    timestamp.facilitySMDGCode = null;

    if(timestamp.timestampDefinitionTO.isTerminalNeeded){
      // Selected terminal is set if terminal option is shown 
      timestamp.facilitySMDGCode = this.terminalSelected?.facilitySMDGCode;
    }

    if (this.eventTimestampDate) {
      timestamp.eventDateTime = new DateToUtcPipe().transform(this.eventTimestampDate, this.eventTimestampTime, this.transportCall.portOfCall?.timezone);
    }

    if (this.locationNameLabel && this.locationName) {
      timestamp.eventLocation = new class implements EventLocation {
        locationName: string
      }
      timestamp.eventLocation.locationName = this.locationName;
      if (this.terminalSelected?.facilitySMDGCode) {
        timestamp.eventLocation.facilityCodeListProvider = "SMDG";
        timestamp.eventLocation.facilityCode = this.terminalSelected?.facilitySMDGCode;
      }
    }

    const latitude = this.timestampFormGroup.controls.vesselPositionLatitude.value;
    const longtitude = this.timestampFormGroup.controls.vesselPositionLongitude.value;
    if (this.showVesselPosition() && latitude && longtitude) {
      timestamp.vesselPosition = new class implements VesselPosition {
        latitude: string = latitude;
        longitude: string = longtitude;
      }
    }
    
    const milesToDestinationPort = this.timestampFormGroup.controls.milesToDestinationPort.value;
    if (this.showmilesToDestinationPortOption() && milesToDestinationPort) {
      timestamp.milesToDestinationPort = Number(milesToDestinationPort);
    }

    // For now we just take set the first value of the publisher pattern as PR assuming that exists in the global
    timestamp.publisherRole = this.globals.config.publisherRoles.find(pb => pb === timestamp.timestampDefinitionTO.publisherPattern[0].publisherRole)


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
    this.timestampTypes.push({ label: this.translate.instant('general.timestamp.select'), value: null });
    for (let timestampDef of this.timestampDefinitions) {
      if (!this.globals.config.publisherRoles.includes(timestampDef.publisherPattern[0].publisherRole)) { // For now we just take first value of the publisher pattern
        continue;
      }
      if (!this.globals.config.enableJIT11Timestamps && timestampDef.providedInStandard == 'jit1_1') {
        continue
      }
      this.timestampTypes.push({ label: timestampDef.timestampTypeName, value: timestampDef })
    }
  }

  private updateDelayCodeOptions() {
    this.delayCodeOptions = [];
    this.delayCodeOptions.push({ label: this.translate.instant('general.comment.select'), value: null });
    this.delayCodes.forEach(delayCode => {
      this.delayCodeOptions.push({ label: delayCode.smdgCode, value: delayCode })
    });
  }

  private updateTerminalOptions(UNLocationCode: string) {
    this.terminalService.getTerminalsByUNLocationCode(UNLocationCode).subscribe(terminals => {
      this.globals.terminals = terminals;
      this.terminalOptions = [];
      this.terminalOptions.push({ label: this.translate.instant('general.terminal.select'), value: null });
      terminals.forEach(terminal => {
        this.terminalOptions.push({ label: terminal.facilitySMDGCode, value: terminal })
      });
      this.defaultTerminalValue();
    })
  }
  
  defaultTerminalValue() {
    this.terminalSelected = this.terminalOptions.find(terminal => terminal?.value?.facilitySMDGCode === this.transportCall?.facilityCode)?.value ?? null;
  }

  close() {
    this.ref.close(null);
  }

  validatePortOfCallTimestamp(): boolean {
    return !(
      this.timestampTypeSelected && this.eventTimestampDate && this.eventTimestampTime
    );
  }

  setEventTimestampToNow() {
    let eventTimestampDat = new Date();
    this.eventTimestampTime = this.leftPadWithZero(eventTimestampDat.getHours()) + ":" + this.leftPadWithZero(eventTimestampDat.getMinutes());
  }

  private leftPadWithZero(item: number): String {
    return (String('0').repeat(2) + item).substr((2 * -1), 2);
  }

  /*
  Generating default timestamp based on configs & selected transport call. 
  */
  private async generateDefaultTimestamp() {
    this.defaultTimestamp.logOfTimestamp = new Date();
    this.defaultTimestamp.transportCallID = this.transportCall.transportCallID;
    this.defaultTimestamp.portOfCall = this.transportCall.portOfCall;
    this.defaultTimestamp.vesselIMONumber = this.transportCall.vesselIMONumber;
    this.defaultTimestamp.UNLocationCode = this.transportCall.UNLocationCode;
    this.defaultTimestamp.carrierServiceCode = this.transportCall.carrierServiceCode;
    this.defaultTimestamp.importVoyageNumber = this.transportCall.importVoyageNumber;
    this.defaultTimestamp.exportVoyageNumber = this.transportCall.exportVoyageNumber;
    this.defaultTimestamp.carrierVoyageNumber = this.transportCall.carrierVoyageNumber;

    // Set publisher based on globals
    this.defaultTimestamp.publisher = this.globals.config.publisher;
    this.defaultTimestamp.transportCallSequenceNumber = this.transportCall.transportCallSequenceNumber;
  }
}
