import {EventLocationRequirement} from 'src/app/model/enums/eventLocationRequirement';
import {TimestampInfo} from "../../model/jit/timestamp-info";
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService, SelectItem } from "primeng/api";
import { Port } from "../../model/portCall/port";
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { DelayCode } from "../../model/portCall/delayCode";
import { DateToUtcPipe } from "../../controller/pipes/date-to-utc.pipe";
import { DelayCodeService } from "../../controller/services/base/delay-code.service";
import { LangChangeEvent, TranslateService } from "@ngx-translate/core";
import { TransportCall } from "../../model/jit/transport-call";
import { TimestampMappingService } from "../../controller/services/mapping/timestamp-mapping.service";
import { Timestamp } from "../../model/jit/timestamp";
import { Globals } from "../../model/portCall/globals";
import { VesselPosition } from "../../model/vesselPosition";
import { TerminalService } from 'src/app/controller/services/base/terminal.service';
import { TimestampDefinitionService } from "../../controller/services/base/timestamp-definition.service";
import { TimestampDefinitionTO } from "../../model/jit/timestamp-definition";
import { ErrorHandler } from 'src/app/controller/services/util/errorHandler';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FacilityCodeListProvider } from 'src/app/model/enums/facilityCodeListProvider';
import { TimestampResponseStatus } from 'src/app/model/enums/timestamp-response-status';

@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss'],
  providers: [
    DialogService,
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
  eventTimestampDate: AbstractControl;
  eventTimestampTime: AbstractControl;
  timestampTypeSelected: AbstractControl;
  creationProgress: boolean = false;
  locationNameLabel: string;
  transportCall: TransportCall;
  timestampDefinitions: TimestampDefinitionTO[] = [];
  timestampTypes: SelectItem[] = [];
  delayCodeOptions: SelectItem[] = [];
  delayCodes: DelayCode[];
  terminalOptions: SelectItem[] = [];
  milesToDestinationPort: string;
  timestampResponseStatus: TimestampResponseStatus;
  responseTimestampDefinitionTO: TimestampDefinitionTO;
  respondingToTimestampInfo: TimestampInfo;

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

    this.transportCall = this.config.data.transportCall;
    this.timestampResponseStatus = this.config.data.timestampResponseStatus;
    this.responseTimestampDefinitionTO = this.config.data.responseTimestampDefinitionTO;
    this.respondingToTimestampInfo = this.config.data.respondingToTimestamp;

    this.timestampFormGroup = this.formBuilder.group({
      vesselPositionLongitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(11)]),
      vesselPositionLatitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(10)]),
      milesToDestinationPort: new FormControl(null, [Validators.pattern('^[0-9]+(.[0-9]?)?$')]),
      remark: new FormControl(null),
      delayCode: new FormControl({value: ''}) ,
      terminal: new FormControl({value: ''}),
      timestampType: new FormControl(null,[Validators.required]),
      eventTimestampDate: new FormControl(null,[Validators.required]),
      eventTimestampTime: new FormControl(null,[Validators.required]),
      locationName: new FormControl(null),
    });
    this.timestampTypeSelected = this.timestampFormGroup.controls.timestampType;
    this.eventTimestampDate = this.timestampFormGroup.controls.eventTimestampDate;
    this.eventTimestampTime = this.timestampFormGroup.controls.eventTimestampTime;
    this.determineTimestampResponseStatus();
    this.updateTerminalOptions(this.transportCall.UNLocationCode);    
  }

  determineTimestampResponseStatus(){
    if( this.timestampResponseStatus === TimestampResponseStatus.CREATE){
      this.timestampDefinitionService.getTimestampDefinitions().subscribe(timestampDefinitions => {
        this.timestampDefinitions = timestampDefinitions;
        this.updateTimestampTypeOptions();
      })  
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateTimestampTypeOptions();
      });
     } else if (this.timestampResponseStatus === TimestampResponseStatus.REJECTED){
      this.timestampTypeSelected.setValue(this.responseTimestampDefinitionTO);
      this.timestampTypeSelected.setValidators(null);
      this.timestampTypeSelected.updateValueAndValidity();
      this.setDefaultTimestampValues();
    } else if (this.timestampResponseStatus === TimestampResponseStatus.ACCEPTED){
      this.timestampTypeSelected.setValue(this.responseTimestampDefinitionTO);
      this.timestampTypeSelected.setValidators(null);
      this.timestampTypeSelected.updateValueAndValidity();
      this.eventTimestampDate.setValidators(null);
      this.eventTimestampDate.updateValueAndValidity();
      this.eventTimestampTime.setValidators(null);
      this.eventTimestampTime.updateValueAndValidity();
      this.setDefaultTimestampValues();
    }
  }

  parseTimestampResponseStatus() {
    switch (this.timestampResponseStatus) {
      case TimestampResponseStatus.CREATE: return "CREATE";
      case TimestampResponseStatus.ACCEPTED: return "ACCEPTED";
      case TimestampResponseStatus.REJECTED: return "REJECTED";
    }
  }

  createButtonText(): string {
    switch (this.timestampResponseStatus) {
      case TimestampResponseStatus.CREATE: return 'general.save.editor.label';
      case TimestampResponseStatus.ACCEPTED: return 'general.save.Accepteditor.label';
      case TimestampResponseStatus.REJECTED: return 'general.save.Rejecteditor.label';
    }
  }

  showVesselPosition(): boolean {
    if (!this.globals.config.enableVesselPositions) return false;
    return this.timestampTypeSelected?.value?.isVesselPositionNeeded ?? false;
  }

  showLocationNameOption(): boolean {
    this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(this.timestampTypeSelected.value);
    if (this.timestampTypeSelected?.value?.eventLocationRequirement == EventLocationRequirement.REQUIRED) {
      this.timestampFormGroup.controls.locationName.setValidators([Validators.required]);
    } else {
      this.timestampFormGroup.controls.locationName.setValidators(null);
    }
    this.timestampFormGroup.controls.locationName.updateValueAndValidity();
    return this.locationNameLabel !== undefined;
  }

  showTerminalOption(): boolean {
    return this.timestampTypeSelected?.value?.isTerminalNeeded ?? false;
  }

  showMilesToDestinationPortOption(): boolean {
    return this.timestampTypeSelected?.value?.isMilesToDestinationRelevant ?? false;;
  }

  saveTimestamp() {
    const timestampDefinition: TimestampDefinitionTO = this.timestampTypeSelected.value
    const terminalSelected = this.timestampFormGroup.controls.terminal.value;
    const locationName = this.timestampFormGroup.controls.locationName.value;

    const milesToDestinationPort = this.timestampFormGroup.controls.milesToDestinationPort.value;
    let vesselPosition: VesselPosition = null;
    let eventDateTime: Date | string = this.respondingToTimestampInfo?.operationsEventTO.eventDateTime;

    // Only update eventDateTime of timestamp when creating & rejecting
    if (this.timestampResponseStatus == TimestampResponseStatus.CREATE || this.timestampResponseStatus == TimestampResponseStatus.REJECTED) {
      eventDateTime = new DateToUtcPipe().transform(this.eventTimestampDate.value, this.eventTimestampTime.value, this.transportCall.portOfCall?.timezone);
    }

    const latitude = this.timestampFormGroup.controls.vesselPositionLatitude.value;
    const longitude = this.timestampFormGroup.controls.vesselPositionLongitude.value;
    if (this.showVesselPosition() && latitude && longitude) {
      vesselPosition = {
        latitude: latitude,
        longitude: longitude,
      }
    }

    let newTimestamp: Timestamp = this.timestampMappingService.createTimestampStub(
      this.transportCall,
      timestampDefinition,
      this.respondingToTimestampInfo?.operationsEventTO  // generally null, but if present, use it
    )

    // TODO: Let the user choose the role
    newTimestamp.publisherRole = this.timestampMappingService.overlappingPublisherRoles(timestampDefinition)[0]
    newTimestamp.facilitySMDGCode = terminalSelected?.facilitySMDGCode
    newTimestamp.eventLocation.facilityCode = terminalSelected?.facilitySMDGCode
    newTimestamp.eventLocation.facilityCodeListProvider = terminalSelected?.facilitySMDGCode ? FacilityCodeListProvider.SMDG : null
    newTimestamp.delayReasonCode = this.timestampFormGroup.controls.delayCode.value?.smdgCode
    newTimestamp.milesToDestinationPort = this.showMilesToDestinationPortOption() && milesToDestinationPort ? Number(milesToDestinationPort) : null
    newTimestamp.remark = this.timestampFormGroup.controls.remark.value
    newTimestamp.eventDateTime = eventDateTime
    newTimestamp.vesselPosition = vesselPosition;

    if (this.locationNameLabel && locationName) {
      newTimestamp.eventLocation.locationName = locationName
    }

    this.creationProgress = true;
    this.timestampMappingService.addPortCallTimestamp(newTimestamp).subscribe({
      next: () => {
        this.creationProgress = false;
        this.messageService.add(
          {
            key: 'GenericSuccessToast',
            severity: 'success',
            summary: this.translate.instant('general.save.editor.success.summary'),
            detail: this.translate.instant('general.save.editor.success.detail')
          })
        this.ref.close(newTimestamp);
      },
      error: errorResponse => {
        let errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse);
        this.messageService.add(
          {
            key: 'GenericErrorToast',
            severity: 'error',
            summary: this.translate.instant('general.save.editor.failure.detail'),
            detail: errorMessage
          })
        this.creationProgress = false;
      }
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
  this.timestampFormGroup.controls.terminal.setValue(
    this.terminalOptions.find(terminal => terminal?.value?.facilitySMDGCode === this.transportCall?.facilityCode)?.value ?? null);
  }

  close() {
    this.ref.close(null);
  }

  setEventTimestampToNow() {
    let eventTimestampDat = new Date();
    this.eventTimestampTime.setValue(
      this.leftPadWithZero(eventTimestampDat.getHours()) + ":" + this.leftPadWithZero(eventTimestampDat.getMinutes()));
  }

  private setDefaultTimestampValues() {
    this.timestampFormGroup.controls.locationName.setValue(this.respondingToTimestampInfo.operationsEventTO.eventLocation.locationName);
  }
  private leftPadWithZero(item: number): String {
    return (String('0').repeat(2) + item).substr((2 * -1), 2);
  }

}
