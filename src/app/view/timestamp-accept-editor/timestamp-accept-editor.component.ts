import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MessageService, SelectItem } from "primeng/api";
import { Port } from "../../model/portCall/port";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { DelayCode } from "../../model/portCall/delayCode";
import { DelayCodeService } from "../../controller/services/base/delay-code.service";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { TransportCall } from "../../model/jit/transport-call";
import { TimestampMappingService } from "../../controller/services/mapping/timestamp-mapping.service";
import { Timestamp } from "../../model/jit/timestamp";
import { Globals } from "../../model/portCall/globals";
import { EventLocation } from "../../model/eventLocation";
import { VesselPosition } from "../../model/vesselPosition";
import { TerminalService } from 'src/app/controller/services/base/terminal.service';
import { TimestampDefinitionTO } from "../../model/jit/timestamp-definition";
import { DateToUtcPipe } from 'src/app/controller/pipes/date-to-utc.pipe';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EventLocationRequirement } from 'src/app/model/enums/eventLocationRequirement';
import {TimestampInfo} from "../../model/jit/timestamp-info";
import {FacilityCodeListProvider} from "../../model/enums/facilityCodeListProvider";

@Component({
  selector: 'app-timestamp-accept-editor',
  templateUrl: './timestamp-accept-editor.component.html',
  styleUrls: ['./timestamp-accept-editor.component.scss'],
  providers: [
    DialogService,
  ]
})
export class TimestampAcceptEditorComponent implements OnInit {
  @Output('timeStampAddedNotifier') timeStampAddedNotifier: EventEmitter<Timestamp> = new EventEmitter<Timestamp>()

  timestampFormGroup: FormGroup;
  eventTimestampDate: AbstractControl;
  eventTimestampTime: AbstractControl;
  creationProgress: boolean = false;
  locationNameLabel: string;
  milesToDestinationPort: string;

  VesselPositionLabel: boolean;
  transportCall: TransportCall;
  delayCodeOptions: SelectItem[] = [];
  delayCodes: DelayCode[];
  respondingToTimestampInfo: TimestampInfo;
  terminalOptions: SelectItem[] = [];
  timestampResponseStatus: string;
  responseTimestampDefinitionTO: TimestampDefinitionTO;


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
    this.respondingToTimestampInfo = this.config.data.respondingToTimestamp;
    this.timestampResponseStatus = this.config.data.timestampResponseStatus
    this.responseTimestampDefinitionTO = this.config.data.responseTimestampTO
    this.updateTerminalOptions(this.transportCall.UNLocationCode);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
    this.timestampFormGroup = this.formBuilder.group({
      vesselPositionLongitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(11)]),
      vesselPositionLatitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(10)]),
      milesToDestinationPort: new FormControl(null, [Validators.pattern('^[0-9]+(.[0-9]?)?$')]),
      remark: new FormControl(null),
      delayCode: new FormControl({value: ''}) ,
      terminal: new FormControl({value: ''}),
      eventTimestampDate: new FormControl(null),
      eventTimestampTime: new FormControl(null),
      locationName: new FormControl(null)
    });
    this.eventTimestampDate = this.timestampFormGroup.controls.eventTimestampDate;
    this.eventTimestampTime = this.timestampFormGroup.controls.eventTimestampTime;
    this.setDefaultTimestampValues();
  }

  showVesselPosition(): boolean {
    if (!this.globals.config.enableVesselPositions) return false;
    this.VesselPositionLabel = this.responseTimestampDefinitionTO.isVesselPositionNeeded;
    return this.VesselPositionLabel ?? false;
  }

  showLocationNameOption(): boolean {
    this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(this.responseTimestampDefinitionTO);
    if (this.responseTimestampDefinitionTO?.eventLocationRequirement == EventLocationRequirement.REQUIRED) {
      this.timestampFormGroup.controls.locationName.setValidators([Validators.required]);
    } else{
      this.timestampFormGroup.controls.locationName.setValidators(null);
    }
    this.timestampFormGroup.controls.locationName.updateValueAndValidity();
    return this.locationNameLabel !== undefined;
  }

  showTerminalOption(): boolean {
    return this.responseTimestampDefinitionTO.isTerminalNeeded ?? false;
  }

  showMilesToDestinationPortOption(): boolean {
    return this.responseTimestampDefinitionTO.isMilesToDestinationRelevant ?? false;
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
      const defaultTerminal = terminals.find(terminal => terminal.facilitySMDGCode == this.respondingToTimestampInfo.operationsEventTO.eventLocation.facilityCode);
      this.timestampFormGroup.controls.terminal.setValue(defaultTerminal);
      this.terminalOptions.push({ label: this.translate.instant('general.terminal.select'), value: null });
      terminals.forEach(terminal => {
        this.terminalOptions.push({ label: terminal.facilitySMDGCode, value: terminal })
      });
    })
  }
  setEventTimestampToNow() {
    let eventTimestampDat = new Date();
    let formattedTime = this.leftPadWithZero(eventTimestampDat.getHours()) + ":" + this.leftPadWithZero(eventTimestampDat.getMinutes());
    this.eventTimestampTime.setValue(formattedTime);
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
  saveTimestamp() {

    const terminalSelected = this.timestampFormGroup.controls.terminal.value;
    const locationName = this.timestampFormGroup.controls.locationName.value;

    const milesToDestinationPort = this.timestampFormGroup.controls.milesToDestinationPort.value;
    let vesselPosition : VesselPosition = null;
    let eventDateTime : Date|string = this.respondingToTimestampInfo.operationsEventTO.eventDateTime;
    // Only update eventDateTime of timestamp when rejecting
    if (this.timestampResponseStatus == 'Rejected' && this.eventTimestampDate.value && this.eventTimestampTime.value) {
      eventDateTime = new DateToUtcPipe().transform(this.eventTimestampDate.value, this.eventTimestampTime.value, this.transportCall.portOfCall?.timezone);
    }

    const latitude = this.timestampFormGroup.controls.vesselPositionLatitude.value;
    const longitude = this.timestampFormGroup.controls.vesselPositionLongitude.value;
    if (latitude && longitude) {
      vesselPosition = {
        latitude: latitude,
        longitude: longitude,
      }
    }

    let newTimestamp : Timestamp = this.timestampMappingService.createTimestampStub(
      this.transportCall,
      this.responseTimestampDefinitionTO,
      this.respondingToTimestampInfo?.operationsEventTO,
    )

    // TODO: Let the user choose the role
    newTimestamp.publisherRole = this.timestampMappingService.overlappingPublisherRoles(this.responseTimestampDefinitionTO)[0]
    newTimestamp.facilitySMDGCode = terminalSelected?.facilitySMDGCode
    newTimestamp.eventLocation.facilityCode = terminalSelected.facilitySMDGCode
    newTimestamp.eventLocation.facilityCodeListProvider = terminalSelected.facilitySMDGCode ? FacilityCodeListProvider.SMDG : null
    newTimestamp.delayReasonCode = this.timestampFormGroup.controls.delayCode.value?.smdgCode
    newTimestamp.milesToDestinationPort = milesToDestinationPort ? Number(milesToDestinationPort) : null
    newTimestamp.remark = this.timestampFormGroup.controls.remark.value
    newTimestamp.eventDateTime = eventDateTime
    newTimestamp.vesselPosition = vesselPosition;

    if (this.locationNameLabel && locationName) {
      newTimestamp.eventLocation.locationName = locationName
    }

    // Post timestamp
    this.creationProgress = true;
    this.timestampMappingService.addPortCallTimestamp(newTimestamp).subscribe({
      next: () => {
        this.creationProgress = false;
        this.messageService.add(
          {
            key: 'TimestampAddSuccess',
            severity: 'success',
            summary: this.translate.instant('general.save.editor.success.summary'),
            detail: this.translate.instant('general.save.editor.success.detail')
          })
        this.ref.close(newTimestamp);
      },
      error: error => {
        this.messageService.add(
          {
            key: 'TimestampAddError',
            severity: 'error',
            summary: this.translate.instant('general.save.editor.failure.summary'),
            detail: this.translate.instant('general.save.editor.failure.detail') + error.message
          })
        this.creationProgress = false;
      }
    })
  }

  private setDefaultTimestampValues() {
    this.timestampFormGroup.controls.locationName.setValue(this.respondingToTimestampInfo.operationsEventTO.eventLocation.locationName);
  }

  close() {
    this.ref.close(null);
  }

}
