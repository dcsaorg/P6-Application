import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService, SelectItem } from "primeng/api";
import { Port } from "../../model/portCall/port";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { DelayCode } from "../../model/portCall/delayCode";
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
import { TimestampDefinitionTO } from "../../model/jit/timestamp-definition";
import { DateToUtcPipe } from 'src/app/controller/pipes/date-to-utc.pipe';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-timestamp-accept-editor',
  templateUrl: './timestamp-accept-editor.component.html',
  styleUrls: ['./timestamp-accept-editor.component.scss'],
  providers: [
    DialogService,
    VesselIdToVesselPipe
  ]
})
export class TimestampAcceptEditorComponent implements OnInit {
  @Input('vesselId') vesselId: number;
  @Input('vesselSavedId') vesselSavedId: number;
  @Input('portOfCall') portOfCall: Port;
  @Input('TransportCallSelected') transportCallSelected: TransportCall;

  @Output('timeStampAddedNotifier') timeStampAddedNotifier: EventEmitter<Timestamp> = new EventEmitter<Timestamp>()

  timestampFormGroup: FormGroup;
  eventTimestampDate: Date;
  eventTimestampTime: string;
  creationProgress: boolean = false;
  locationNameLabel: string;
  locationName: string;
  milesToDestinationPort: string;
  ports: Port[] = [];

  VesselPositionLabel: boolean;
  transportCall: TransportCall;
  timestampDefinitions: TimestampDefinitionTO[] = [];
  timestampTypes: SelectItem[] = [];
  delayCodeOptions: SelectItem[] = [];
  delayCodes: DelayCode[];
  delayCode: DelayCode;
  responseTimestamp: Timestamp;
  terminalOptions: SelectItem[] = [];
  terminalSelected: Terminal;
  timestampResponseStatus: string;


  constructor(
    private formBuilder: FormBuilder,
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
    this.transportCall = this.config.data.transportCall;
    this.responseTimestamp = this.config.data.respondingToTimestamp;
    this.timestampResponseStatus = this.config.data.timestampResponseStatus
    this.ports = this.config.data.ports;
    this.updateTerminalOptions(this.transportCall.UNLocationCode);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
    this.timestampFormGroup = this.formBuilder.group({
      vesselPositionLongitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(11)]),
      vesselPositionLatitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(10)]),
      milesToDestinationPort: new FormControl(null, [Validators.pattern('^[0-9]+(.[0-9]{0,1})?$')]),
    });
    this.setDefaultTimestampValues();
  }

  showVesselPosition(): boolean {
    if (!this.globals.config.enableVesselPositions) return false;
    this.VesselPositionLabel = this.responseTimestamp.timestampDefinitionTO.isVesselPositionNeeded;
    return this.VesselPositionLabel ?? false;
  }

  showLocationNameOption(): boolean {
    this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(this.responseTimestamp.timestampDefinitionTO);
    return this.locationNameLabel !== undefined;
  }

  showTerminalOption(): boolean {
    return this.responseTimestamp.timestampDefinitionTO.isTerminalNeeded ?? false;
  }

  showmilesToDestinationPortOption(): boolean {
    return this.responseTimestamp.timestampDefinitionTO.isMilesToDestinationRelevant ?? false;
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
      this.terminalSelected = terminals.find(terminal => terminal.facilitySMDGCode == this.responseTimestamp.facilitySMDGCode);
      this.terminalOptions.push({ label: this.translate.instant('general.terminal.select'), value: null });
      terminals.forEach(terminal => {
        this.terminalOptions.push({ label: terminal.facilitySMDGCode, value: terminal })
      });
    })
  }
  setEventTimestampToNow() {
    let eventTimestampDat = new Date();
    this.eventTimestampTime = this.leftPadWithZero(eventTimestampDat.getHours()) + ":" + this.leftPadWithZero(eventTimestampDat.getMinutes());
  }

  private leftPadWithZero(item: number): String {
    return (String('0').repeat(2) + item).substr((2 * -1), 2);
  }

  validatePortOfCallTimestamp(): boolean {
    if (this.timestampResponseStatus == "Rejected") {
      return !(
        this.eventTimestampDate && this.eventTimestampTime
      );
    }
  }
  savePortcallTimestamp() {

    // Set delay code if specified
    this.responseTimestamp.delayReasonCode = (this.delayCode ? this.delayCode.smdgCode : null);
    // set terminal if specified

    // Nulled - as not to inherent older values
    this.responseTimestamp.eventLocation = null;
    this.responseTimestamp.vesselPosition = null;
    this.responseTimestamp.facilitySMDGCode = null;

    if (this.responseTimestamp.timestampDefinitionTO.isTerminalNeeded) {
      // Selected terminal is set (Whether inhereted or new).
      this.responseTimestamp.facilitySMDGCode = (this.terminalSelected?.facilitySMDGCode ? this.terminalSelected?.facilitySMDGCode : null);
    }

    if (this.locationNameLabel && this.locationName) {
      // Present value on label is set (Whether inhereted or new).
      this.responseTimestamp.eventLocation = new class implements EventLocation {
        locationName: string
      }
      this.responseTimestamp.eventLocation.locationName = this.locationName;
    }

    const latitude = this.timestampFormGroup.controls.vesselPositionLatitude.value;
    const longtitude = this.timestampFormGroup.controls.vesselPositionLongitude.value;
    if (latitude && longtitude) {
      this.responseTimestamp.vesselPosition = new class implements VesselPosition {
        latitude: string = latitude;
        longitude: string = longtitude;
      }
    }

    const milesToDestinationPort = this.timestampFormGroup.controls.milesToDestinationPort.value;
    if (milesToDestinationPort) {
      // Present value on label is set (Whether inhereted or new).
      this.responseTimestamp.milesToDestinationPort = Number(milesToDestinationPort);
    }
    
    // Only update eventDateTime of timestamp when rejecting
    if (this.timestampResponseStatus == 'Rejected' && this.eventTimestampDate && this.eventTimestampTime) {
      this.responseTimestamp.eventDateTime = new DateToUtcPipe().transform(this.eventTimestampDate, this.eventTimestampTime, this.transportCall.portOfCall?.timezone);
    }

    // Post timestamp
    this.creationProgress = true;
    this.timestampMappingService.addPortCallTimestamp(this.responseTimestamp).subscribe(() => {
      this.creationProgress = false;
      this.messageService.add(
        {
          key: 'TimestampAddSuccess',
          severity: 'success',
          summary: this.translate.instant('general.save.editor.success.summary'),
          detail: this.translate.instant('general.save.editor.success.detail')
        })
      this.ref.close(this.responseTimestamp);
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

  private setDefaultTimestampValues() {
    this.locationName = this.responseTimestamp.eventLocation?.locationName;
    this.timestampFormGroup.controls.vesselPositionLatitude.setValue(this.responseTimestamp.vesselPosition?.latitude);
    this.timestampFormGroup.controls.vesselPositionLongitude.setValue(this.responseTimestamp.vesselPosition?.longitude);
    this.timestampFormGroup.controls.milesToDestinationPort.setValue(this.responseTimestamp?.milesToDestinationPort);
  }

  close() {
    this.ref.close(null);
  }

}
