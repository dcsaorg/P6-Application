import { EventLocationRequirement } from 'src/app/model/enums/eventLocationRequirement';
import { TimestampInfo } from "../../model/jit/timestamp-info";
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
import { PublisherRole } from 'src/app/model/enums/publisherRole';
import {VesselService} from "../../controller/services/base/vessel.service";
import {Vessel} from "../../model/portCall/vessel";
import {ShowTimestampAsJsonDialogComponent} from "../show-json-dialog/show-timestamp-as-json-dialog.component";
import { NegotiationCycle } from "../../model/portCall/negotiation-cycle";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-timestamp-editor',
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss'],
  providers: [
    DialogService,
  ]
})
export class TimestampEditorComponent implements OnInit {
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
  terminalOptions: SelectItem[] = [];
  publisherRoleOptions: SelectItem[] = [];
  publisherRoles: PublisherRole[] = [];
  negotiationCycles: SelectItem<NegotiationCycle>[] = [];
  selectedNegotiationCycle: NegotiationCycle = null;
  timestampResponseStatus: TimestampResponseStatus;
  responseTimestampDefinitionTO: TimestampDefinitionTO;
  respondingToTimestampInfo: TimestampInfo;
  TimestampResponseStatus = TimestampResponseStatus;
  fullVesselDetails: Vessel;
  delayCodes: Observable<DelayCode[]>;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private delayCodeService: DelayCodeService,
    public globals: Globals,
    public config: DynamicDialogConfig,
    private translate: TranslateService,
    public ref: DynamicDialogRef,
    private timestampDefinitionService: TimestampDefinitionService,
    private timestampMappingService: TimestampMappingService,
    private terminalService: TerminalService,
    private vesselService: VesselService,
    private dialogService: DialogService,
  ) {
  }

  ngOnInit(): void {
    this.delayCodes = this.delayCodeService.getDelayCodes();

    this.transportCall = this.config.data.transportCall;
    this.timestampResponseStatus = this.config.data.timestampResponseStatus;
    this.responseTimestampDefinitionTO = this.config.data.responseTimestampDefinitionTO;
    this.respondingToTimestampInfo = this.config.data.respondingToTimestamp;

    this.vesselService.getVessel(this.transportCall.vessel.vesselIMONumber)
      .subscribe(vessel => {
        this.fullVesselDetails = vessel
        this.updateVesselDraftOption();
      })

    this.timestampFormGroup = this.formBuilder.group({
      vesselPositionLongitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(11)]),
      vesselPositionLatitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(10)]),
      milesToDestinationPort: new FormControl(null, [Validators.pattern('^[0-9]+(.[0-9]?)?$')]),
      remark: new FormControl(null),
      delayCode: new FormControl({ value: '' }),
      terminal: new FormControl({ value: '' }),
      timestampType: new FormControl(null, [Validators.required]),
      eventTimestampDate: new FormControl(null, [Validators.required]),
      eventTimestampTime: new FormControl(null, [Validators.required]),
      locationName: new FormControl(null),
      publisherRole: new FormControl(null),
      vesselDraft: new FormControl(null, [Validators.pattern('^[0-9]+(.[0-9]?)?$')]),
    });
    this.timestampTypeSelected = this.timestampFormGroup.controls.timestampType;
    this.eventTimestampDate = this.timestampFormGroup.controls.eventTimestampDate;
    this.eventTimestampTime = this.timestampFormGroup.controls.eventTimestampTime;
    this.determineTimestampResponseStatus();
    this.updateTerminalOptions(this.transportCall.UNLocationCode);
    this.updatePublisherRoleOptions();
  }

  determineTimestampResponseStatus() {
    if (this.timestampResponseStatus === TimestampResponseStatus.CREATE) {
      this.timestampDefinitionService.getNegotiationCycles().subscribe(cycles => {
        this.negotiationCycles = [{
          label: this.translate.instant('general.negotiationCycle.select'),
          value: null
        }]
        for (let cycle of cycles) {
          this.negotiationCycles.push({ label: cycle.cycleName, value: cycle })
        }
      });
      this.timestampDefinitionService.getTimestampDefinitions().subscribe(timestampDefinitions => {
        this.timestampDefinitions = timestampDefinitions;
        this.updateTimestampTypeOptions();
      })
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.updateTimestampTypeOptions();
      });
    } else if (this.timestampResponseStatus === TimestampResponseStatus.REJECT) {
      this.timestampTypeSelected.setValue(this.responseTimestampDefinitionTO);
      this.timestampTypeSelected.setValidators(null);
      this.timestampTypeSelected.updateValueAndValidity();
      this.setDefaultTimestampValues();
    } else if (this.timestampResponseStatus === TimestampResponseStatus.ACCEPT) {
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

  createButtonText(): string {
    switch (this.timestampResponseStatus) {
      case TimestampResponseStatus.CREATE: return 'general.save.editor.label';
      case TimestampResponseStatus.ACCEPT: return 'general.save.Accepteditor.label';
      case TimestampResponseStatus.REJECT: return 'general.save.Rejecteditor.label';
    }
  }

  showVesselPosition(): boolean {
    const vesselPositionRequirement = this.timestampTypeSelected?.value?.vesselPositionRequirement;
    return vesselPositionRequirement !== undefined && vesselPositionRequirement !== EventLocationRequirement.EXCLUDED;
  }

  updateVesselPositionRequirement() {
    let validators = null;
    const timestampTypeSelected = this.timestampTypeSelected?.value;
    if (timestampTypeSelected?.vesselPositionRequirement === EventLocationRequirement.REQUIRED) {
      validators = [Validators.required];
    }
    this.timestampFormGroup.controls.vesselPositionLatitude.setValidators(validators);
    this.timestampFormGroup.controls.vesselPositionLongitude.setValidators(validators);
    this.timestampFormGroup.controls.vesselPositionLatitude.updateValueAndValidity();
    this.timestampFormGroup.controls.vesselPositionLongitude.updateValueAndValidity();
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
    let validator = null;
    if (this.timestampTypeSelected?.value?.isTerminalNeeded) {
      validator = [Validators.required];
    }
    this.timestampFormGroup.controls.terminal.setValidators(validator);
    this.timestampFormGroup.controls.terminal.updateValueAndValidity();
    return this.timestampTypeSelected?.value?.isTerminalNeeded;
  }

  showMilesToDestinationPortOption(): boolean {
    return this.timestampTypeSelected?.value?.isMilesToDestinationRelevant ?? false;
  }

  showPublisherRoleOption(): boolean {
    if (this.publisherRoles.length > 1) {
      this.timestampFormGroup.controls.publisherRole.setValidators([Validators.required]);
    } else {
      this.timestampFormGroup.controls.publisherRole.setValidators(null);
    }
    this.timestampFormGroup.controls.publisherRole.updateValueAndValidity();
    return this.publisherRoles.length > 1;
  }


  showJSON() {
    const timestampDefinition: TimestampDefinitionTO = this.timestampTypeSelected.value;
    let newTimestamp = this.generateTimestamp();
    this.dialogService.open(ShowTimestampAsJsonDialogComponent, {
      header: 'JSON Example',
      width: '75%',
      data: {
        payload: newTimestamp,
        timestampDefinition: timestampDefinition,
      }
    });
  }

  saveTimestamp() {
    let newTimestamp = this.generateTimestamp();
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

  onSelectedNegotiationCycle(event) {
    this.selectedNegotiationCycle = event.value;
    this.timestampTypeSelected.setValue(null);
    this.timestampTypeSelected.updateValueAndValidity();
    this.updateTimestampTypeOptions()
  }

  private generateTimestamp(): Timestamp {
    const timestampDefinition: TimestampDefinitionTO = this.timestampTypeSelected.value;
    const publisherRoleSelected = this.timestampFormGroup.controls.publisherRole.value;
    const terminalSelected = this.timestampFormGroup.controls.terminal.value;
    const locationName = this.timestampFormGroup.controls.locationName.value;
    const milesToDestinationPort = this.timestampFormGroup.controls.milesToDestinationPort.value;
    let vesselPosition: VesselPosition = null;
    let eventDateTime: Date | string = this.respondingToTimestampInfo?.operationsEventTO.eventDateTime;

    // Only update eventDateTime of timestamp when creating & rejecting
    if (this.timestampResponseStatus === TimestampResponseStatus.CREATE || this.timestampResponseStatus === TimestampResponseStatus.REJECT) {
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
      this.fullVesselDetails,
      this.respondingToTimestampInfo?.operationsEventTO  // generally null, but if present, use it
    )

    newTimestamp.publisherRole = publisherRoleSelected ? publisherRoleSelected : this.publisherRoles[0];
    newTimestamp.facilitySMDGCode = terminalSelected?.facilitySMDGCode
    newTimestamp.eventLocation.facilityCode = terminalSelected?.facilitySMDGCode
    newTimestamp.eventLocation.facilityCodeListProvider = terminalSelected?.facilitySMDGCode ? FacilityCodeListProvider.SMDG : null
    newTimestamp.delayReasonCode = this.timestampFormGroup.controls.delayCode.value?.smdgCode
    newTimestamp.milesToDestinationPort = this.showMilesToDestinationPortOption() && milesToDestinationPort ? Number(milesToDestinationPort) : null
    newTimestamp.remark = this.timestampFormGroup.controls.remark.value
    newTimestamp.eventDateTime = eventDateTime
    newTimestamp.vesselPosition = vesselPosition;

    if (this.fullVesselDetails?.dimensionUnit) {
      newTimestamp.vessel.draft = this.timestampFormGroup.controls.vesselDraft.value;
    }

    if (this.locationNameLabel && locationName) {
      newTimestamp.eventLocation.locationName = locationName
    }

    return newTimestamp;
  }

  private updateTimestampTypeOptions() {
    this.timestampTypes = [];
    this.timestampTypes.push({ label: this.translate.instant('general.timestamp.select'), value: null });
    for (let timestampDef of this.timestampDefinitions) {
      if (timestampDef.implicitVariantOf) {
        // Ignore the implicit versions that have an explicit version.
        continue;
      }
      if (this.selectedNegotiationCycle && timestampDef.negotiationCycle.cycleKey != this.selectedNegotiationCycle.cycleKey) {
        continue;
      }
      if (!timestampDef.publisherPattern.some(pr => this.globals.config.publisherRoles.includes(pr.publisherRole))) {
        continue;
      }
      this.timestampTypes.push({ label: timestampDef.timestampTypeName, value: timestampDef })
    }
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

  updatePublisherRoleOptions() {
    this.publisherRoles = this.timestampMappingService.overlappingPublisherRoles(this?.timestampTypeSelected?.value);
    this.publisherRoleOptions = [];
    this.publisherRoleOptions.push({ label: this.translate.instant('general.publisherRole.select'), value: null });
    this.publisherRoles.forEach(pr => {
      this.publisherRoleOptions.push({ label: pr, value: pr })
    })
  }

  defaultTerminalValue() {
    if (this.timestampResponseStatus === TimestampResponseStatus.CREATE) {
      this.timestampFormGroup.controls.terminal.setValue(
        this.terminalOptions.find(terminal => terminal?.value?.facilitySMDGCode === this.transportCall?.facilityCode)?.value ?? null);
    } else {
      this.timestampFormGroup.controls.terminal.setValue(
        this.terminalOptions.find(terminal => terminal?.value?.facilitySMDGCode === this.respondingToTimestampInfo.operationsEventTO?.eventLocation?.facilityCode)?.value ?? null);
    }
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

  hasDimensionUnit() {
    return this?.fullVesselDetails?.dimensionUnit ?? null;
  }

  updateVesselDraftOption() {
    if (this?.fullVesselDetails?.dimensionUnit) {
      this.timestampFormGroup.controls.vesselDraft.enable();
    } else {
      this.timestampFormGroup.controls.vesselDraft.disable();
    }
    this.timestampFormGroup.controls.vesselDraft.updateValueAndValidity();
  }

}
