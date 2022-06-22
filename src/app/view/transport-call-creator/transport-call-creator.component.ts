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
import {EventClassifierCode} from "../../model/jit/eventClassifierCode";
import {OperationsEventTypeCode} from "../../model/enums/operationsEventTypeCode";
import {Publisher} from "../../model/publisher";
import {PublisherRole} from "../../model/enums/publisherRole";
import {DateToUtcPipe} from "../../controller/pipes/date-to-utc.pipe";
import {EventLocation} from "../../model/eventLocation";
import {VesselPosition} from "../../model/vesselPosition";
import { PortService } from 'src/app/controller/services/base/port.service';
import { TerminalService } from 'src/app/controller/services/base/terminal.service';
import {TimestampDefinition} from "../../model/jit/timestamp-definition";
import {TimestampDefinitionService} from "../../controller/services/base/timestamp-definition.service";

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
  facilityCodeListProviderOptions: SelectItem[] = [];
  creationProgress: boolean;
  vessels: Vessel[] = [];


  timestamp: Timestamp;
  eventTimestampDate: Date;
  eventTimestampTime: String;
  timestampSelected: TimestampDefinition;
  timestampDefinitions: TimestampDefinition[] = [];
  timestampTypes: SelectItem[] = [];
  delayCodeOptions: SelectItem[] = [];
  delayCodes: DelayCode[];
  delayCode: DelayCode;
  defaultTimestampRemark: string;
  timestampchecking: boolean;
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
      timestampchecking: new FormControl(null),
      serviceCode: new FormControl(null, [Validators.required, Validators.maxLength(5)]),
      exportVoyageNumber: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      importVoyageNumber: new FormControl(null, [Validators.maxLength(50)]),
      port: new FormControl(null, [Validators.required]),
      terminal: new FormControl({value: ''}, [Validators.required]),
      vessel: new FormControl(null, [Validators.required]),
      timestampType: new FormControl(null),
      delayCode: new FormControl(null),
      eventTimestampTime: new FormControl(null),
      eventTimestampDate: new FormControl(null),
      defaultTimestampRemark: new FormControl(null),
      locationName: new FormControl(null),
      vesselPositionLongitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(11)]),
      vesselPositionLatitude: new FormControl(null, [Validators.pattern("^[0-9.]*$"), Validators.maxLength(10)]),
    });
  }

  close() {
    this.ref.close(null);
  }

  private updateTerminalOptions(unLocationCode:string) {
    this.terminalService.getTerminalsByUNLocationCode(unLocationCode).subscribe(terminals => {
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
      this.updateTerminalOptions(this.portOfCall.unLocationCode);
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
        this.portOptions.push({label: port.unLocationName, value: port});
      });
    });
  }

  updateTimestampTypeOptions() {
    this.timestampTypes = [];
    this.timestampTypes.push({label: this.translate.instant('general.timestamp.select'), value: null});
    for (let timestampDef of this.timestampDefinitions) {
      if (!this.globals.config.publisherRoles.includes(timestampDef.publisherRole)) {
        continue;
      }
      if (!this.globals.config.enableJIT11Timestamps && timestampDef.providedInStandard == 'jit1_1') {
        continue
      }
      this.timestampTypes.push({label: timestampDef.timestampTypeName, value: timestampDef})
    }
  }

  updateDelayCodeOptions() {
    this.delayCodeOptions = [];
    this.delayCodeOptions.push({label: this.translate.instant('general.comment.select'), value: null});
    this.delayCodes.forEach(delayCode => {
      this.delayCodeOptions.push({label: delayCode.smdgCode, value: delayCode})
    });
  }

  leftPadWithZero(item: number): String {
    return (String('0').repeat(2) + item).substr((2 * -1), 2);
  }

  setEventTimestampToNow() {
    this.eventTimestampDate = new Date();
    this.eventTimestampTime = this.leftPadWithZero(this.eventTimestampDate.getHours()) + ":" + this.leftPadWithZero(this.eventTimestampDate.getMinutes());
    // this line automatically sets the current date as of now
    /* this.transportCallFormGroup.controls.eventTimestampDate.setValue(this.eventTimestampDate); */
    this.transportCallFormGroup.controls.eventTimestampTime.setValue(this.eventTimestampTime);
  }

  showVesselPosition(): boolean {
    if (!this.globals.config.enableVesselPositions) return false;
    const selectedTimestamp = this.transportCallFormGroup.controls.timestampType.value;
    return selectedTimestamp?.isVesselPositionNeeded ?? false;
  }

  showLocationNameOption(): boolean {
    const timestampType = this.transportCallFormGroup.controls.timestampType.value;
    this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(timestampType);
    return this.locationNameLabel !== undefined;
  }


  showTerminalOption(): boolean {
    const selectedTimestamp = this.transportCallFormGroup.controls.timestampType.value;
    return selectedTimestamp?.isTerminalNeeded ?? false;
  }

  shouldCreateTimestamp(): boolean {
    let timestampType = this.transportCallFormGroup.get('timestampType');
    let eventTimestampDate = this.transportCallFormGroup.get('eventTimestampDate');
    let eventTimestampTime = this.transportCallFormGroup.get('eventTimestampTime');
    if (this.timestampchecking) {
      timestampType.setValidators([Validators.required])
      eventTimestampDate.setValidators([Validators.required])
      eventTimestampTime.setValidators([Validators.required])
    } else {
      timestampType.setValidators(null)
      eventTimestampDate.setValidators(null)
      eventTimestampTime.setValidators(null)
    }
    timestampType.updateValueAndValidity();
    eventTimestampDate.updateValueAndValidity();
    eventTimestampTime.updateValueAndValidity();

    return this.timestampchecking;
  }

  canCreateTimestamp(): boolean {
    this.timestampSelected = this.transportCallFormGroup.controls.timestampType.value;
    return this.timestampSelected != null && this.transportCallFormGroup.controls.eventTimestampDate.value && this.transportCallFormGroup.controls.eventTimestampTime.value;
  }

  createButtonText(): string {
    if (this.shouldCreateTimestamp()) return 'general.transportCall.createWithTimestamp';
    return 'general.transportCall.create';
  }

  get addressForm() {
    return this.transportCallFormGroup.get('timestampchecking') as FormGroup;
  }

  async saveNewTransportCall() {
    this.creationProgress = true;
    let transportCall: TransportCall = new class implements TransportCall {
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
      latestEventCreatedDateTime: Date;
    }

    let terminal: Terminal = this.transportCallFormGroup.controls.terminal.value
    let port: Port = this.transportCallFormGroup.controls.port.value

    transportCall.transportCallSequenceNumber = 1;
    transportCall.modeOfTransport = "VESSEL";

    transportCall.vessel = this.transportCallFormGroup.controls.vessel.value;
    transportCall.UNLocationCode = port.unLocationCode;

    transportCall.exportVoyageNumber = this.transportCallFormGroup.controls.exportVoyageNumber.value;
    transportCall.importVoyageNumber = this.transportCallFormGroup.controls.importVoyageNumber.value;

    if(!transportCall.importVoyageNumber){
      transportCall.importVoyageNumber = transportCall.exportVoyageNumber
    }

    transportCall.carrierServiceCode = this.transportCallFormGroup.controls.serviceCode.value;
    transportCall.facilityTypeCode = FacilityTypeCode.POTE

    // Timestamp
    this.timestampSelected = this.transportCallFormGroup.controls.timestampType.value;
    let createTimestamp = this.canCreateTimestamp();

    this.timestamp = new class implements Timestamp {
      UNLocationCode: string;
      eventClassifierCode: EventClassifierCode;
      eventDateTime: Date | string;
      facilityTypeCode: FacilityTypeCode;
      operationsEventTypeCode: OperationsEventTypeCode;
      publisher: Publisher;
      publisherRole: PublisherRole;
      vesselIMONumber: string;
      delayReasonCode: string;
      timestampDefinition: TimestampDefinition;
    }

    if (this.shouldCreateTimestamp() && createTimestamp) {
      this.timestamp.UNLocationCode = transportCall.UNLocationCode;
      this.timestamp.carrierServiceCode = transportCall.carrierServiceCode;
      this.timestamp.importVoyageNumber = transportCall.importVoyageNumber;
      this.timestamp.exportVoyageNumber = transportCall.exportVoyageNumber;
      this.timestamp.facilityTypeCode = transportCall.facilityTypeCode;
      this.timestamp.publisherRole = null;
      this.timestamp.publisher = this.globals.config.publisher;
      this.delayCode = this.transportCallFormGroup.controls.delayCode.value;
      this.timestamp.delayReasonCode = (this.delayCode ? this.delayCode.smdgCode : null);
      this.timestamp.remark = this.transportCallFormGroup.controls.defaultTimestampRemark.value;
      this.timestamp.vesselIMONumber = transportCall.vessel.vesselIMONumber;
      this.timestamp.facilitySMDGCode = terminal.facilitySMDGCode;

      const locationName = this.transportCallFormGroup.controls.locationName.value;
      let eventLocation = new class implements EventLocation {
        locationName: string
        UNLocationCode: string = transportCall.UNLocationCode;

        facilityCode: string = terminal.facilitySMDGCode;
        facilityCodeListProvider: FacilityCodeListProvider;
      }
      if(eventLocation.facilityCode ){
        eventLocation.facilityCodeListProvider = FacilityCodeListProvider.SMDG
      }
      if (this.locationNameLabel && locationName) {
       eventLocation.locationName = locationName
      }

      const latitude = this.transportCallFormGroup.controls.vesselPositionLatitude.value;
      const longtitude = this.transportCallFormGroup.controls.vesselPositionLongitude.value;
      if (latitude && longtitude) {
        this.timestamp.vesselPosition = new class implements VesselPosition {
          latitude: string = latitude;
          longitude: string = longtitude;
        }
      }

      this.timestamp.eventLocation = eventLocation;

      let date = this.transportCallFormGroup.controls.eventTimestampDate.value as Date;
      let time = this.transportCallFormGroup.controls.eventTimestampTime.value;
      this.timestamp.eventDateTime = this.dateToUTC.transform(date, time, this.portOfCall.timezone);

      this.timestamp.timestampDefinition = this.timestampSelected;

      this.creationProgress = true;
      this.timestampMappingService.addPortCallTimestamp(this.timestamp).subscribe(() => {
          this.creationProgress = false;
          this.messageService.add(
            {
              key: 'TimestampAddSuccess',
              severity: 'success',
              summary: this.translate.instant('general.save.editor.success.summary'),
              detail: this.translate.instant('general.save.editor.success.detail')
            })

          this.ref.close(this.timestamp);
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
      return;
    }

    this.transportCallService.addTransportCall(transportCall).subscribe(transportCall => {
        this.creationProgress = false;

        this.messageService.add(
          {
            key: 'TransportcallAddSuccess',
            severity: 'success',
            summary: this.translate.instant('general.transportCall.validation.success.summary'),
            detail: this.translate.instant('general.transportCall.validation.success.detail')
          });
        this.ref.close(transportCall);
      },
      error => {
        this.creationProgress = false;
        this.messageService.add(
          {
            key: 'TransportcallAddError',
            severity: 'error',
            summary: this.translate.instant('general.transportCall.validation.error.summary'),
            detail: this.translate.instant('general.transportCall.validation.error.detail') + error.message
          });
      })
  }

}
