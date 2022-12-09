import {EventLocationRequirement} from 'src/app/model/enums/eventLocationRequirement';
import {TimestampInfo} from '../../model/jit/timestamp-info';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MessageService} from 'primeng/api';
import {Port} from '../../model/portCall/port';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {DelayCode} from '../../model/portCall/delayCode';
import {DateToUtcPipe} from '../../controller/pipes/date-to-utc.pipe';
import {DelayCodeService} from '../../controller/services/base/delay-code.service';
import {TranslateService} from '@ngx-translate/core';
import {TransportCall} from '../../model/jit/transport-call';
import {TimestampMappingService} from '../../controller/services/mapping/timestamp-mapping.service';
import {Timestamp} from '../../model/jit/timestamp';
import {Globals} from '../../model/portCall/globals';
import {VesselPosition} from '../../model/vesselPosition';
import {TerminalService} from 'src/app/controller/services/base/terminal.service';
import {TimestampDefinitionService} from '../../controller/services/base/timestamp-definition.service';
import {TimestampDefinitionTO} from '../../model/jit/timestamp-definition';
import {ErrorHandler} from 'src/app/controller/services/util/errorHandler';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {FacilityCodeListProvider} from 'src/app/model/enums/facilityCodeListProvider';
import {TimestampResponseStatus} from 'src/app/model/enums/timestamp-response-status';
import {PublisherRole, PublisherRoleDetail} from 'src/app/model/enums/publisherRole';
import {VesselService} from '../../controller/services/base/vessel.service';
import {Vessel} from '../../model/portCall/vessel';
import {ShowTimestampAsJsonDialogComponent} from '../show-json-dialog/show-timestamp-as-json-dialog.component';
import {NegotiationCycle} from '../../model/portCall/negotiation-cycle';
import {BehaviorSubject, mergeMap, Observable, take} from 'rxjs';
import {filter, map, shareReplay, tap, toArray} from 'rxjs/operators';
import {PublisherRoleService} from '../../controller/services/base/publisher-role.service';
import {OperationsEventTypeCode} from '../../model/enums/operationsEventTypeCode';
import {VesselEditorComponent} from '../vessel-editor/vessel-editor.component';
import { Terminal } from 'src/app/model/portCall/terminal';

@Component({
  selector: 'app-timestamp-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timestamp-editor.component.html',
  styleUrls: ['./timestamp-editor.component.scss'],
  providers: [
    DialogService,
  ]
})
export class TimestampEditorComponent implements OnInit {
  @Input('portOfCall') portOfCall: Port;
  @Input('TransportCallSelected') transportCallSelected: TransportCall;

  @Output() onTimestampCreation: EventEmitter<Timestamp> = new EventEmitter<Timestamp>();

  timestampFormGroup: FormGroup;
  timestamps: Timestamp[];
  eventTimestampDate: AbstractControl;
  eventTimestampTime: AbstractControl;
  timestampTypeSelected: AbstractControl;
  creationProgress = false;
  locationNameLabel: string;
  transportCall: TransportCall;
  timestampDefinitions$: Observable<TimestampDefinitionTO[]>;
  terminals: Terminal[] = [];
  negotiationCycles$: Observable<NegotiationCycle[]>;
  selectedNegotiationCycle$ = new BehaviorSubject<NegotiationCycle|null>(null);
  timestampResponseStatus: TimestampResponseStatus;
  responseTimestampDefinitionTO: TimestampDefinitionTO;
  respondingToTimestampInfo: TimestampInfo;
  TimestampResponseStatus = TimestampResponseStatus;
  fullVesselDetails: Vessel;
  delayCodes$: Observable<DelayCode[]>;
  selectedTimestampDefinition$ = new BehaviorSubject<TimestampDefinitionTO>(null);
  showVesselPosition$: Observable<boolean>;
  selectablePublisherRoles$: Observable<PublisherRoleDetail[]>;
  allPublisherRoles$: Observable<PublisherRoleDetail[]>;

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
    private publisherRoleService: PublisherRoleService,
  ) {
  }

  ngOnInit(): void {
    this.delayCodes$ = this.delayCodeService.getDelayCodes();
    this.transportCall = this.config.data.transportCall;
    this.timestampResponseStatus = this.config.data.timestampResponseStatus;
    this.responseTimestampDefinitionTO = this.config.data.responseTimestampDefinitionTO;
    this.respondingToTimestampInfo = this.config.data.respondingToTimestamp;

    this.timestampFormGroup = this.formBuilder.group({
      vesselPositionLongitude: new FormControl(null),
      vesselPositionLatitude: new FormControl(null),
      milesToDestinationPort: new FormControl(null, [Validators.pattern('^[0-9]+([.][0-9]?)?$')]),
      remark: new FormControl(null),
      delayCode: new FormControl({ value: '' }),
      terminal: new FormControl({ value: '' }),
      timestampType: new FormControl(null, [Validators.required]),
      eventTimestampDate: new FormControl(null, [Validators.required]),
      eventTimestampTime: new FormControl(null, [Validators.required]),
      locationName: new FormControl(null),
      publisherRole: new FormControl(null),
      vesselDraft: new FormControl(null, [Validators.pattern('^[0-9]+([.][0-9]?)?$')]),
    });

    this.allPublisherRoles$ = this.publisherRoleService.getPublisherRoleDetails();

    this.vesselService.getVessel(this.transportCall.vessel.vesselIMONumber)
      .pipe(take(1))
      .subscribe(vessel => this.setFullVesselDetails(vessel));

    this.timestampTypeSelected = this.timestampFormGroup.controls.timestampType;
    this.eventTimestampDate = this.timestampFormGroup.controls.eventTimestampDate;
    this.eventTimestampTime = this.timestampFormGroup.controls.eventTimestampTime;
    this.determineTimestampResponseStatus();
    this.updateTerminalOptions(this.transportCall.UNLocationCode);
    this.showVesselPosition$ = this.selectedTimestampDefinition$.pipe(
      map(timestampDefinition => this.updateVesselPositionRequirements(timestampDefinition)),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      })
    );
    this.selectablePublisherRoles$ = this.selectedTimestampDefinition$.pipe(
      map(timestampDefinition => this.timestampMappingService.overlappingPublisherRoles(timestampDefinition)),
      mergeMap(publisherRoles => {
        return this.allPublisherRoles$.pipe(
          map(publisherRoleDetails => publisherRoles.map(pr => publisherRoleDetails.find(prd => prd.publisherRole === pr))),
        );
      }),
      tap(publisherRoleDetails => this.updatePublisherRoleFormControl(publisherRoleDetails)),
      shareReplay({
        bufferSize: 1,
        refCount: true,
      })
    );
  }

  private fetchTimestampDefinitions(): Observable<TimestampDefinitionTO[]> {
    const timestampDefinitions$ = this.timestampDefinitionService.getTimestampDefinitions();
    return this.selectedNegotiationCycle$.pipe(
      mergeMap(negotiationCycle => timestampDefinitions$.pipe(
        // Flattens the list to a one-by-one pipe
        mergeMap(t => t),
        // Ignore the implicit versions that have an explicit version.
        filter(ts => !ts.implicitVariantOf),
        filter(ts => !negotiationCycle || ts.negotiationCycle.cycleKey === negotiationCycle.cycleKey),
        filter(ts => ts.publisherPattern.some(pr => this.globals.config.publisherRoles.includes(pr.publisherRole))),
        toArray(),
      ))
    );
  }

  determineTimestampResponseStatus(): void {
    if (this.timestampResponseStatus === TimestampResponseStatus.CREATE) {
      this.negotiationCycles$ = this.timestampDefinitionService.getNegotiationCyclesForPublisherRoles(
        new Set<PublisherRole>(this.globals.config.publisherRoles)
      );
      this.timestampDefinitions$ = this.fetchTimestampDefinitions();
    } else if (this.timestampResponseStatus === TimestampResponseStatus.REJECT) {
      this.timestampTypeSelected.setValue(this.responseTimestampDefinitionTO);
      this.timestampTypeSelected.setValidators(null);
      this.timestampTypeSelected.updateValueAndValidity();
      this.setDefaultTimestampValues();
      // Pretend the user selected the timestamp (triggers relevant
      // fields to be displayed).
      this.updateTimestampDefinition();
    } else if (this.timestampResponseStatus === TimestampResponseStatus.ACCEPT) {
      this.timestampTypeSelected.setValue(this.responseTimestampDefinitionTO);
      this.timestampTypeSelected.setValidators(null);
      this.timestampTypeSelected.updateValueAndValidity();
      this.eventTimestampDate.setValidators(null);
      this.eventTimestampDate.updateValueAndValidity();
      this.eventTimestampTime.setValidators(null);
      this.eventTimestampTime.updateValueAndValidity();
      this.setDefaultTimestampValues();
      // Pretend the user selected the timestamp (triggers relevant
      // fields to be displayed).
      this.updateTimestampDefinition();
    }
  }

  createButtonText(): string {
    switch (this.timestampResponseStatus) {
      case TimestampResponseStatus.CREATE: return 'general.save.editor.label';
      case TimestampResponseStatus.ACCEPT: return 'general.save.Accepteditor.label';
      case TimestampResponseStatus.REJECT: return 'general.save.Rejecteditor.label';
    }
  }

  private shouldShowVesselPosition(selectedTimestamp: TimestampDefinitionTO | null): boolean {
    const effectiveVesselRequirement = selectedTimestamp?.vesselPositionRequirement ?? EventLocationRequirement.EXCLUDED;
    return effectiveVesselRequirement !== EventLocationRequirement.EXCLUDED;
  }

  private vesselPositionValidator(required: boolean, maxlength: number): ValidatorFn[] {
    const val = [
      Validators.pattern('^-?\\d{1,3}(?:\\.\\d{1,10})?$'),
      Validators.maxLength(maxlength),
    ];
    if (required) {
      val.push(Validators.required);
    }
    return val;
  }

  private updateVesselPositionRequirements(selectedTimestamp: TimestampDefinitionTO | null): boolean {
    const vesselPositionLatitude = this.timestampFormGroup.controls.vesselPositionLatitude;
    const vesselPositionLongitude = this.timestampFormGroup.controls.vesselPositionLongitude;
    const shouldShowVesselPosition = this.shouldShowVesselPosition(selectedTimestamp);
    if (shouldShowVesselPosition) {
      const required = selectedTimestamp.vesselPositionRequirement === EventLocationRequirement.REQUIRED;
      vesselPositionLatitude.setValidators(this.vesselPositionValidator(required, 10));
      vesselPositionLongitude.setValidators(this.vesselPositionValidator(required, 11));
    } else {
      vesselPositionLatitude.setValidators(null);
      vesselPositionLongitude.setValidators(null);
    }
    vesselPositionLatitude.updateValueAndValidity();
    vesselPositionLongitude.updateValueAndValidity();
    return shouldShowVesselPosition;
  }

  showLocationNameOption(): boolean {
    return this.locationNameLabel !== undefined;
  }

  showTerminalOption(): boolean {
    return this.timestampTypeSelected?.value?.isTerminalNeeded;
  }

  showMilesToDestinationPortOption(): boolean {
    return this.timestampTypeSelected?.value?.isMilesToDestinationRelevant ?? false;
  }

  private updateLocationNameRequirement(selectedTimestamp: TimestampDefinitionTO|null): void {
    this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(selectedTimestamp);
    if (selectedTimestamp.eventLocationRequirement === EventLocationRequirement.REQUIRED) {
      this.timestampFormGroup.controls.locationName.setValidators([Validators.required]);
    } else {
      this.timestampFormGroup.controls.locationName.setValidators(null);
    }
    this.timestampFormGroup.controls.locationName.updateValueAndValidity();
  }

  private updateTerminalRequirement(selectedTimestamp: TimestampDefinitionTO|null): void {
    let validator = null;
    if (selectedTimestamp?.isTerminalNeeded) {
      validator = [Validators.required];
    }
    this.timestampFormGroup.controls.terminal.setValidators(validator);
    this.timestampFormGroup.controls.terminal.updateValueAndValidity();
  }

  private updatePublisherRoleFormControl(publisherRoleDetails: PublisherRoleDetail[]): void {
    const control = this.timestampFormGroup.controls.publisherRole;
    const selectedPublisherRoleDetail = control.value as PublisherRoleDetail|null;
    if (publisherRoleDetails.length > 1) {
      control.setValidators([Validators.required]);
    } else {
      control.setValidators(null);
    }
    if (publisherRoleDetails.length === 1) {
      // If there is only option, set it into the form (then the submission can just always check the form)
      control.setValue(publisherRoleDetails[0]);
    } else if (selectedPublisherRoleDetail
               && !publisherRoleDetails.find(v => v.publisherRole === selectedPublisherRoleDetail.publisherRole)) {
      control.setValue(null);
    }
    control.updateValueAndValidity();
  }

  showJSON(): void {
    const timestampDefinition: TimestampDefinitionTO = this.timestampTypeSelected.value;
    const newTimestamp = this.generateTimestamp();
    this.dialogService.open(ShowTimestampAsJsonDialogComponent, {
      header: 'JSON Example',
      width: '75%',
      data: {
        payload: newTimestamp,
        timestampDefinition: timestampDefinition,
      }
    });
  }

  saveTimestamp(): void {
    if (this.creationProgress) {
      // It is sometimes possible to trigger multiple timestamps despite the
      // debounceClick and "disabled while creating"-feature
      return;
    }
    this.creationProgress = true;
    const newTimestamp = this.generateTimestamp();
    this.timestampMappingService.addPortCallTimestamp(newTimestamp).subscribe({
      next: () => {
        this.creationProgress = false;
        this.messageService.add(
          {
            key: 'GenericSuccessToast',
            severity: 'success',
            summary: this.translate.instant('general.save.editor.success.summary'),
            detail: this.translate.instant('general.save.editor.success.detail')
          });
        this.ref.close(newTimestamp);
      },
      error: errorResponse => {
        const errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse);
        this.messageService.add(
          {
            key: 'GenericErrorToast',
            severity: 'error',
            summary: this.translate.instant('general.save.editor.failure.detail'),
            detail: errorMessage
          });
        this.creationProgress = false;
      }
    });
  }

  onSelectedNegotiationCycle(event): void {
    const negotiationCycle: NegotiationCycle = event.value;
    this.timestampTypeSelected.setValue(null);
    this.timestampTypeSelected.updateValueAndValidity();
    this.selectedNegotiationCycle$.next(negotiationCycle);
  }

  private generateTimestamp(): Timestamp {
    const timestampDefinition: TimestampDefinitionTO = this.timestampTypeSelected.value;
    const publisherRoleSelected = this.timestampFormGroup.controls.publisherRole.value as PublisherRoleDetail;
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
    if (this.shouldShowVesselPosition(timestampDefinition) && latitude && longitude) {
      vesselPosition = {
        latitude: latitude,
        longitude: longitude,
      };
    }

    const newTimestamp: Timestamp = this.timestampMappingService.createTimestampStub(
      this.transportCall,
      timestampDefinition,
      this.fullVesselDetails,
      this.respondingToTimestampInfo?.operationsEventTO  // generally null, but if present, use it
    );

    newTimestamp.publisherRole = publisherRoleSelected.publisherRole;
    newTimestamp.facilitySMDGCode = terminalSelected?.facilitySMDGCode;
    newTimestamp.eventLocation.facilityCode = terminalSelected?.facilitySMDGCode;
    newTimestamp.eventLocation.facilityCodeListProvider = terminalSelected?.facilitySMDGCode ? FacilityCodeListProvider.SMDG : null;
    newTimestamp.delayReasonCode = this.timestampFormGroup.controls.delayCode.value?.smdgCode;
    newTimestamp.milesToDestinationPort = this.showMilesToDestinationPortOption() && milesToDestinationPort ? Number(milesToDestinationPort) : null;
    newTimestamp.remark = this.timestampFormGroup.controls.remark.value;
    newTimestamp.eventDateTime = eventDateTime;
    newTimestamp.vesselPosition = vesselPosition;

    if (this.fullVesselDetails?.dimensionUnit) {
      newTimestamp.vessel.draft = this.timestampFormGroup.controls.vesselDraft.value;
    }

    if (this.locationNameLabel && locationName) {
      newTimestamp.eventLocation.locationName = locationName;
    }

    return newTimestamp;
  }

  private updateTerminalOptions(UNLocationCode: string): void {
    this.terminalService.getTerminalsByUNLocationCode(UNLocationCode).pipe(take(1)).subscribe(terminals => {
      this.terminals = terminals;
      this.defaultTerminalValue();
    });
  }

  updateTimestampDefinition(): void {
    const timestampDefinitionTO: TimestampDefinitionTO = this.timestampTypeSelected.value;
    if (this.timestampResponseStatus === TimestampResponseStatus.CREATE
        && this.eventTimestampDate.pristine
        && this.eventTimestampTime.pristine) {
      if (timestampDefinitionTO.operationsEventTypeCode === OperationsEventTypeCode.CANC
          || timestampDefinitionTO.operationsEventTypeCode === OperationsEventTypeCode.OMIT) {
        this.eventTimestampDate.setValue(new Date());
        this.setEventTimestampToNow();
      } else {
        this.eventTimestampDate.setValue(null);
        this.eventTimestampTime.setValue(null);
      }
      this.eventTimestampDate.updateValueAndValidity();
      this.eventTimestampTime.updateValueAndValidity();
    }

    this.updateLocationNameRequirement(timestampDefinitionTO);
    this.updateTerminalRequirement(timestampDefinitionTO);
    this.selectedTimestampDefinition$.next(timestampDefinitionTO);
  }

  defaultTerminalValue(): void {
    if (this.timestampResponseStatus === TimestampResponseStatus.CREATE) {
      this.timestampFormGroup.controls.terminal.setValue(
        this.terminals.find(terminal => terminal?.facilitySMDGCode === this.transportCall?.facilityCode) ?? null);
    } else {
      this.timestampFormGroup.controls.terminal.setValue(
        this.terminals.find(terminal => terminal?.facilitySMDGCode === this.respondingToTimestampInfo.operationsEventTO?.eventLocation?.facilityCode) ?? null);
    }
  }

  editVessel(): void {
    this.vesselService.editVessel(
      this.fullVesselDetails,
      (v) =>  this.dialogService.open(VesselEditorComponent, {
        header: this.translate.instant('general.vessel.edit.header'),
        width: '50%',
        data: v
      }).onClose
    ).pipe(take(1)).subscribe(v => {
      if (v) {
        this.setFullVesselDetails(v);
      }
    });
  }

  close(): void {
    this.ref.close(null);
  }

  setEventTimestampToNow(): void {
    const eventTimestampDate = new Date();
    this.eventTimestampTime.setValue(
      this.leftPadWithZero(eventTimestampDate.getHours()) + ':' + this.leftPadWithZero(eventTimestampDate.getMinutes()));
  }

  private setDefaultTimestampValues(): void {
    this.timestampFormGroup.controls.locationName.setValue(this.respondingToTimestampInfo.operationsEventTO.eventLocation.locationName);
  }
  private leftPadWithZero(item: number): string {
    return (String('0').repeat(2) + item).substr((2 * -1), 2);
  }

  hasDimensionUnit(): boolean {
    return !!this.fullVesselDetails?.dimensionUnit;
  }

  setFullVesselDetails(vessel: Vessel): void {
    this.fullVesselDetails = vessel;
    if (this.fullVesselDetails?.dimensionUnit) {
      this.timestampFormGroup.controls.vesselDraft.enable();
    } else {
      this.timestampFormGroup.controls.vesselDraft.disable();
    }
    this.timestampFormGroup.controls.vesselDraft.updateValueAndValidity();
  }

}
