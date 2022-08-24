import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../model/portCall/globals";
import {MessageService, SelectItem} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {Port} from "../../model/portCall/port";
import {TransportCall} from "../../model/jit/transport-call";
import {FacilityTypeCode} from "../../model/enums/facilityTypeCodeOPR";
import {Terminal} from "../../model/portCall/terminal";
import {TransportCallService} from "../../controller/services/jit/transport-call.service";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {PortCallServiceTypeCode} from 'src/app/model/enums/portCallServiceTypeCode';
import {FacilityCodeListProvider} from "../../model/enums/facilityCodeListProvider";
import {VesselService} from "../../controller/services/base/vessel.service";
import {Vessel} from "../../model/portCall/vessel";
import {DelayCode} from "../../model/portCall/delayCode";
import {Timestamp} from "../../model/jit/timestamp";
import {DelayCodeService} from "../../controller/services/base/delay-code.service";
import {TimestampMappingService} from "../../controller/services/mapping/timestamp-mapping.service";
import {DateToUtcPipe} from "../../controller/pipes/date-to-utc.pipe";
import {EventLocation} from "../../model/eventLocation";
import {VesselPosition} from "../../model/vesselPosition";
import {PortService} from 'src/app/controller/services/base/port.service';
import {TerminalService} from 'src/app/controller/services/base/terminal.service';
import {TimestampDefinitionTO} from "../../model/jit/timestamp-definition";
import {TimestampDefinitionService} from "../../controller/services/base/timestamp-definition.service";
import {EventLocationRequirement} from 'src/app/model/enums/eventLocationRequirement';
import { ErrorHandler } from 'src/app/controller/services/util/errorHandler';
import { PublisherRole } from 'src/app/model/enums/publisherRole';

@Component({
  selector: 'app-add-transport-call',
  templateUrl: './transport-call-creator.component.html',
  styleUrls: ['./transport-call-creator.component.scss']
})
export class TransportCallCreatorComponent implements OnInit {
  transportCallFormGroup: FormGroup;
  portOfCall: Port;
  terminalOptions: SelectItem[] = [];
  portOptions: SelectItem[] = [];
  vesselOptions: SelectItem[] = [];
  creationProgress: boolean;
  vessels: Vessel[] = [];


  eventTimestampDate: Date;
  eventTimestampTime: string;
  timestampDefinitions: TimestampDefinitionTO[] = [];
  timestampTypes: SelectItem[] = [];
  delayCodeOptions: SelectItem[] = [];
  delayCodes: DelayCode[];
  publisherRoleOptions: SelectItem[] = [];
  publisherRoles: PublisherRole[] = [];
  timestampChecking: boolean;
  locationNameLabel: string;

  dateToUTC: DateToUtcPipe

  constructor(private formBuilder: FormBuilder,
              private translate: TranslateService,
              private globals: Globals,
              public ref: DynamicDialogRef,
              private messageService: MessageService,
              private delayCodeService: DelayCodeService,
              private transportCallService: TransportCallService,
              private vesselService: VesselService,
              private timestampDefinitionService: TimestampDefinitionService,
              private timestampMappingService: TimestampMappingService,
              private portService: PortService,
              private terminalService: TerminalService){
  }

  ngOnInit(): void {
    this.creationProgress = false;
    this.updatePortOptions();
    this.updateVesselOptions();

    this.timestampDefinitionService.getTimestampDefinitions().subscribe(timestampDefinitions => {
      this.timestampDefinitions = timestampDefinitions;
      this.updateTimestampTypeOptions();
    })

    this.delayCodeService.getDelayCodes().subscribe(delayCodes => {
      this.delayCodes = delayCodes;
      this.updateDelayCodeOptions()
    });
    this.dateToUTC = new DateToUtcPipe();
    this.transportCallFormGroup = this.formBuilder.group({
      timestampChecking: new FormControl(null),
      serviceCode: new FormControl(null, [Validators.required, Validators.maxLength(5)]),
      exportVoyageNumber: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      importVoyageNumber: new FormControl(null, [Validators.maxLength(50)]),
      port: new FormControl(null, [Validators.required]),
      terminal: new FormControl(null),
      vessel: new FormControl(null, [Validators.required]),
      timestampType: new FormControl(null),
      delayCode: new FormControl(null),
      eventTimestampTime: new FormControl(null),
      eventTimestampDate: new FormControl(null),
      defaultTimestampRemark: new FormControl(null),
      locationName: new FormControl(null),
      vesselPositionLongitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(11)]),
      vesselPositionLatitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(10)]),
      milesToDestinationPort: new FormControl(null, [Validators.pattern('^[0-9]+(.[0-9]?)?$')]),
      publisherRole: new FormControl(null),
    });
  }

  close() {
    this.ref.close(null);
  }

  private updateTerminalOptions(UNLocationCode:string) {
    this.terminalService.getTerminalsByUNLocationCode(UNLocationCode).subscribe(terminals => {
      this.globals.terminals = terminals;
      this.terminalOptions = [];
      this.terminalOptions.push({label: this.translate.instant('general.terminal.select'), value: null});
      terminals.forEach(terminal => {
        if ((this.portOfCall)) {
          this.terminalOptions.push({label: terminal.facilitySMDGCode, value: terminal})
        }
      });
    })
  }

  portSelected() {
    if (this.transportCallFormGroup.controls.port.value) {
      this.portOfCall = this.transportCallFormGroup.controls.port.value;
      this.transportCallFormGroup.controls.terminal.enable();
      this.updateTerminalOptions(this.portOfCall.UNLocationCode);
    }
  }

  private updateVesselOptions() {
    this.vesselService.getVessels().subscribe(vessels => {
      this.vessels = [];
      this.vesselOptions.push({label: this.translate.instant('general.vessel.select'), value: null});
      vessels.forEach(vessel => {
        this.vesselOptions.push({label: vessel.vesselName + ' (' + vessel.vesselIMONumber + ')', value: vessel});
      });
    });
  }

  private updatePortOptions() {
    this.portService.getPorts().subscribe(ports => {
      this.globals.ports = ports;
      this.portOptions = [];
      this.portOptions.push({label: this.translate.instant('general.port.select'), value: null});
      ports.forEach(port => {
        this.portOptions.push({label: port.UNLocationName, value: port});
      });
    });
  }

  updateTimestampTypeOptions() {
    this.timestampTypes = [];
    this.timestampTypes.push({ label: this.translate.instant('general.timestamp.select'), value: null });
    for (let timestampDef of this.timestampDefinitions) {
      if (!timestampDef.publisherPattern.some(pr => this.globals.config.publisherRoles.includes(pr.publisherRole))) { 
        continue;
      }
      if (!this.globals.config.enableJIT11Timestamps && timestampDef.providedInStandard == 'jit1_1') {
        continue
      }
      this.timestampTypes.push({ label: timestampDef.timestampTypeName, value: timestampDef })
    }
  }

  updateDelayCodeOptions() {
    this.delayCodeOptions = [];
    this.delayCodeOptions.push({ label: this.translate.instant('general.comment.select'), value: null });
    this.delayCodes.forEach(delayCode => {
      this.delayCodeOptions.push({ label: delayCode.smdgCode, value: delayCode })
    });
  }

  updatePublisherRoleOptions() {
    const timestampSelected = this.transportCallFormGroup.controls.timestampType?.value;
    this.publisherRoles = this.timestampMappingService.overlappingPublisherRoles(timestampSelected);
    this.publisherRoleOptions = [];
    this.publisherRoleOptions.push({ label: this.translate.instant('general.publisherRole.select'), value: null });
    this.publisherRoles.forEach(pr => {
      this.publisherRoleOptions.push({ label: pr, value: pr })
    })
  }

  leftPadWithZero(item: number): string {
    return (String('0').repeat(2) + item).substr((2 * -1), 2);
  }

  setEventTimestampToNow() {
    this.eventTimestampDate = new Date();
    this.eventTimestampTime = this.leftPadWithZero(this.eventTimestampDate.getHours()) + ":" + this.leftPadWithZero(this.eventTimestampDate.getMinutes());
    this.transportCallFormGroup.controls.eventTimestampTime.setValue(this.eventTimestampTime);
  }

  showPublisherRoleOption(): boolean {  
    if (this.publisherRoles.length > 1) {
      this.transportCallFormGroup.controls.publisherRole.setValidators([Validators.required]);
    } else {
      this.transportCallFormGroup.controls.publisherRole.setValidators(null);
    }
    this.transportCallFormGroup.controls.publisherRole.updateValueAndValidity();
    return this.publisherRoles.length > 1;
  }

  showVesselPosition(): boolean {
    if (!this.globals.config.enableVesselPositions) return false;
    const selectedTimestamp = this.transportCallFormGroup.controls.timestampType.value;
    return selectedTimestamp?.isVesselPositionNeeded ?? false;
  }

  showLocationNameOption(show:boolean = true): boolean {
    let validators = null;
    if (show) {
      const timestampType = this.transportCallFormGroup.controls.timestampType.value;
      this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(timestampType);
      if (timestampType?.eventLocationRequirement == EventLocationRequirement.REQUIRED) {
        validators = [Validators.required];
      }
    }
    this.transportCallFormGroup.controls.locationName.setValidators(validators);
    this.transportCallFormGroup.controls.locationName.updateValueAndValidity();
    return this.locationNameLabel !== undefined;
  }


  showTerminalOption(): boolean {
    const selectedTimestamp = this.transportCallFormGroup.controls.timestampType.value;
    return selectedTimestamp?.isTerminalNeeded ?? false;
  }

  showMilesToDestinationPortOption(): boolean {
    const selectedTimestamp = this.transportCallFormGroup.controls.timestampType.value;
    return selectedTimestamp?.isMilesToDestinationRelevant ?? false;
  }

  shouldCreateTimestamp(): boolean {
    let timestampType = this.transportCallFormGroup.get('timestampType');
    let eventTimestampDate = this.transportCallFormGroup.get('eventTimestampDate');
    let eventTimestampTime = this.transportCallFormGroup.get('eventTimestampTime');
    if (this.timestampChecking) {
      timestampType.setValidators([Validators.required])
      eventTimestampDate.setValidators([Validators.required])
      eventTimestampTime.setValidators([Validators.required])
    } else {
      timestampType.setValidators(null)
      eventTimestampDate.setValidators(null)
      eventTimestampTime.setValidators(null)
      this.showLocationNameOption(false)
    }
    timestampType.updateValueAndValidity();
    eventTimestampDate.updateValueAndValidity();
    eventTimestampTime.updateValueAndValidity();


    return this.timestampChecking;
  }

  canCreateTimestamp(): boolean {
    const timestampSelected = this.transportCallFormGroup.controls.timestampType.value;
    return timestampSelected != null && this.transportCallFormGroup.controls.eventTimestampDate.value && this.transportCallFormGroup.controls.eventTimestampTime.value;
  }

  createButtonText(): string {
    if (this.shouldCreateTimestamp()) return 'general.portVisit.createWithTimestamp';
    return 'general.portVisit.create';
  }

  async saveNewTransportCall() {
    this.creationProgress = true;
    let transportCall: TransportCall = new class implements TransportCall {
      transportCallReference: string;
      UNLocationCode: string;
      carrierServiceCode: string;
      carrierVoyageNumber: string;
      exportVoyageNumber: string;
      importVoyageNumber: string;
      facilityCode: string;
      facilityTypeCode: FacilityTypeCode;
      otherFacility: string;
      sequenceColor: string;
      transportCallID: string;
      transportCallSequenceNumber: number;
      vesselIMONumber: string;
      vesselName: string;
      portCallServiceTypeCode: PortCallServiceTypeCode;
      modeOfTransport: string;
      facilityCodeListProvider: FacilityCodeListProvider;
      location: EventLocation;
      vessel: Vessel;
      etaBerthDateTime: Date;
      atdBerthDateTime: Date;
      omitCreatedDateTime = null;
      latestEventCreatedDateTime: Date;
    }

    const terminal: Terminal = this.transportCallFormGroup.controls.terminal?.value;
    const port: Port = this.transportCallFormGroup.controls.port.value

    transportCall.transportCallSequenceNumber = 1;
    transportCall.modeOfTransport = "VESSEL";

    transportCall.vessel = this.transportCallFormGroup.controls.vessel.value;
    transportCall.UNLocationCode = port.UNLocationCode;

    transportCall.exportVoyageNumber = this.transportCallFormGroup.controls.exportVoyageNumber.value;
    transportCall.importVoyageNumber = this.transportCallFormGroup.controls.importVoyageNumber.value;

    if (!transportCall.importVoyageNumber){
      transportCall.importVoyageNumber = transportCall.exportVoyageNumber
    }
    transportCall.carrierVoyageNumber = transportCall.exportVoyageNumber

    transportCall.carrierServiceCode = this.transportCallFormGroup.controls.serviceCode.value;
    transportCall.facilityTypeCode = FacilityTypeCode.POTE
    transportCall.location = {
      UNLocationCode: port.UNLocationCode,
      facilityCode: null,
      facilityCodeListProvider: null
    }

    if (terminal && this.timestampChecking) {
      transportCall.facilityCode = terminal.facilitySMDGCode
      transportCall.facilityCodeListProvider = FacilityCodeListProvider.SMDG
      transportCall.location.facilityCode = terminal.facilitySMDGCode
      transportCall.location.facilityCodeListProvider = FacilityCodeListProvider.SMDG
    }

    if (this.shouldCreateTimestamp() && this.canCreateTimestamp()) {
      const timestampDefinition : TimestampDefinitionTO = this.transportCallFormGroup.controls.timestampType.value;
      let timestamp : Timestamp = this.timestampMappingService.createTimestampStub(
        transportCall,
        timestampDefinition,
        null,
      )

      const publisherRoleSelected = this.transportCallFormGroup.controls.publisherRole.value;
      let date = this.transportCallFormGroup.controls.eventTimestampDate.value as Date;
      let time = this.transportCallFormGroup.controls.eventTimestampTime.value;
      timestamp.publisherRole = publisherRoleSelected ? publisherRoleSelected : this.publisherRoles[0]; 
      timestamp.publisher = this.globals.config.publisher;
      timestamp.delayReasonCode = this.transportCallFormGroup.controls.delayCode.value?.smdgCode
      timestamp.remark = this.transportCallFormGroup.controls.defaultTimestampRemark.value;
      timestamp.eventDateTime = this.dateToUTC.transform(date, time, this.portOfCall.timezone);

      const milesToDestinationPort = this.transportCallFormGroup.controls.milesToDestinationPort.value;
      if (this.showMilesToDestinationPortOption() && milesToDestinationPort) {
        timestamp.milesToDestinationPort = Number(milesToDestinationPort);
      }

      if (this.locationNameLabel && this.transportCallFormGroup.controls.locationName.value) {
        timestamp.eventLocation.locationName = this.transportCallFormGroup.controls.locationName.value;
      }

      if (terminal) {
        timestamp.facilitySMDGCode = terminal.facilitySMDGCode
        timestamp.eventLocation.facilityCode = terminal.facilitySMDGCode
        timestamp.eventLocation.facilityCodeListProvider = FacilityCodeListProvider.SMDG
      }

      const latitude = this.transportCallFormGroup.controls.vesselPositionLatitude.value;
      const longitude = this.transportCallFormGroup.controls.vesselPositionLongitude.value;
      if (latitude && longitude) {
        timestamp.vesselPosition = new class implements VesselPosition {
          latitude: string = latitude;
          longitude: string = longitude;
        }
      }

      this.creationProgress = true;
      this.timestampMappingService.addPortCallTimestamp(timestamp).subscribe({ next: () => {
          this.creationProgress = false;
          this.messageService.add(
            {
              key: 'GenericSuccessToast',
              severity: 'success',
              summary: this.translate.instant('general.save.editor.success.summary'),
              detail: this.translate.instant('general.save.editor.success.detail')
            })

          this.ref.close(timestamp);
        },
        error: errorResponse => {
          let errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse); 
          this.messageService.add(
            {
              key: 'GenericErrorToast',
              severity: 'error',
              summary: this.translate.instant('general.save.editor.failure.detail'),
              detail:  errorMessage
            })
          this.creationProgress = false;
        }})
      return;
    }

    this.transportCallService.addTransportCall(transportCall).subscribe({ next: transportCall => {
        this.creationProgress = false;
        this.messageService.add(
          {
            key: 'GenericSuccessToast',
            severity: 'success',
            summary: this.translate.instant('general.transportCall.validation.success.summary'),
            detail: this.translate.instant('general.transportCall.validation.success.detail')
          });
        this.ref.close(transportCall);
      },
error: errorResponse => {
        this.creationProgress = false;
        let errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse); 
        this.messageService.add(
          {
            key: 'GenericErrorToast',
            severity: 'error',
            summary: this.translate.instant('general.transportCall.validation.error.detail') ,
            detail:  errorMessage
          });
      }})
  }

}
