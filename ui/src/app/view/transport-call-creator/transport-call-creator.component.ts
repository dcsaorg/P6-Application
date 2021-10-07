import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../model/portCall/globals";
import {MessageService, SelectItem} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {Port} from "../../model/portCall/port";
import {TransportCall} from "../../model/ovs/transport-call";
import {FacilityTypeCode} from "../../model/enums/facilityTypeCodeOPR";
import {Terminal} from "../../model/portCall/terminal";
import {TransportCallService} from "../../controller/services/ovs/transport-call.service";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {PortCallServiceTypeCode} from 'src/app/model/enums/portCallServiceTypeCode';
import {FacilityCodeListProvider} from "../../model/enums/facilityCodeListProvider";
import {VesselService} from "../../controller/services/base/vessel.service";
import {Vessel} from "../../model/portCall/vessel";
import {DelayCode} from "../../model/portCall/delayCode";
import {PortcallTimestampType} from "../../model/portCall/portcall-timestamp-type.enum";
import {Timestamp} from "../../model/ovs/timestamp";
import {DelayCodeService} from "../../controller/services/base/delay-code.service";
import {TimestampMappingService} from "../../controller/services/mapping/timestamp-mapping.service";
import {EventClassifierCode} from "../../model/ovs/eventClassifierCode";
import {OperationsEventTypeCode} from "../../model/ovs/operationsEventTypeCode";
import {Publisher} from "../../model/publisher";
import {PublisherRole} from "../../model/enums/publisherRole";
import {DateToUtcPipe} from "../../controller/pipes/date-to-utc.pipe";
import {EventLocation} from "../../model/eventLocation";

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

  timestampType: string;
  timestamp: Timestamp;
  eventTimestampDate: Date;
  eventTimestampTime: String;
  timestampSelected: string;
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
              private timestampMappingService: TimestampMappingService) {
  }

  ngOnInit(): void {
    this.creationProgress = false;
    this.updatePortOptions();
    this.updateVesselOptions();
    this.updateTimestampTypeOptions();
    this.delayCodeService.getDelayCodes().subscribe(delayCodes => {
      this.delayCodes = delayCodes;
      this.updateDelayCodeOptions()
    });
    this.dateToUTC = new DateToUtcPipe();
    this.transportCallFormGroup = this.formBuilder.group({
      timestampchecking: new FormControl(null),
      serviceCode: new FormControl(null, [Validators.required, Validators.maxLength(5)]),
      voyageNumber: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      port: new FormControl(null, [Validators.required]),
      terminal: new FormControl({value: '', disabled: true}, [Validators.required]),
      vessel: new FormControl(null, [Validators.required]),
      timestampType: new FormControl(null),
      delayCode: new FormControl(null),
      eventTimestampTime: new FormControl(null),
      eventTimestampDate: new FormControl(null),
      defaultTimestampRemark: new FormControl(null),
      locationName: new FormControl(null),
    });
  }

  close() {
    this.ref.close(null);
  }

  private updateTerminalOptions() {
    this.terminalOptions = [];
    this.terminalOptions.push({label: this.translate.instant('general.terminal.select'), value: null});
    this.globals.terminals.forEach(terminal => {
      if (this.portOfCall.id == terminal.port) {
        this.terminalOptions.push({label: terminal.smdgCode, value: terminal})
      }
    })
  }

  portSelected() {
    if (this.transportCallFormGroup.controls.port.value) {
      this.portOfCall = this.transportCallFormGroup.controls.port.value;
      this.transportCallFormGroup.controls.terminal.enable();
      this.updateTerminalOptions();
    }
  }

  // private updateFacilityCodeListProvider() {
  //   this.facilityCodeListProviderOptions.push({label: this.translate.instant('general.carrier.CarrierCodeListProvider.select'), value: null});
  //   this.facilityCodeListProviderOptions.push({label: FacilityCodeListProvider.BIC.toString(), value: FacilityCodeListProvider.BIC});
  //   this.facilityCodeListProviderOptions.push({label: FacilityCodeListProvider.SMDG.toString(), value: FacilityCodeListProvider.SMDG});
  // }

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
    this.portOptions.push({label: this.translate.instant('general.port.select'), value: null});
    this.globals.ports.forEach(port => {
      this.portOptions.push({label: port.unLocode, value: port});
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

  showLocationNameOption(): boolean {
    const timestampType = this.transportCallFormGroup.controls.timestampType.value;
    this.locationNameLabel = this.timestampMappingService.getLocationNameOptionLabel(timestampType);
    return this.locationNameLabel !== undefined;
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
    this.timestampType = this.transportCallFormGroup.controls.timestampType.value;
    return this.timestampType != null && this.transportCallFormGroup.controls.eventTimestampDate.value && this.transportCallFormGroup.controls.eventTimestampTime.value;
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
    }

    let terminal: Terminal = this.transportCallFormGroup.controls.terminal.value
    let port: Port = this.transportCallFormGroup.controls.port.value

    transportCall.transportCallSequenceNumber = 1;
    transportCall.modeOfTransport = "VESSEL";
    transportCall.facilityCodeListProvider = FacilityCodeListProvider.SMDG;

    transportCall.vessel = this.transportCallFormGroup.controls.vessel.value;
    transportCall.facilityCode = terminal.smdgCode;
    transportCall.UNLocationCode = port.unLocode;
    transportCall.carrierVoyageNumber = this.transportCallFormGroup.controls.voyageNumber.value;
    transportCall.carrierServiceCode = this.transportCallFormGroup.controls.serviceCode.value;
    transportCall.facilityTypeCode = FacilityTypeCode.POTE

    // Timestamp
    this.timestampType = this.transportCallFormGroup.controls.timestampType.value;
    let createTimestamp = this.canCreateTimestamp();

    this.timestamp = new class implements Timestamp {
      UNLocationCode: string;
      eventClassifierCode: EventClassifierCode;
      eventDateTime: string | Date;
      facilityTypeCode: FacilityTypeCode;
      operationsEventTypeCode: OperationsEventTypeCode;
      publisher: Publisher;
      publisherRole: PublisherRole;
      vesselIMONumber: string;
      delayReasonCode: string;
      timestampType: PortcallTimestampType;
    }

    if (this.shouldCreateTimestamp() && createTimestamp) {
      this.timestamp.UNLocationCode = transportCall.UNLocationCode;
      this.timestamp.facilitySMDGCode = transportCall.facilityCode;
      this.timestamp.carrierServiceCode = transportCall.carrierServiceCode;
      this.timestamp.carrierVoyageNumber = transportCall.carrierVoyageNumber;
      this.timestamp.facilityTypeCode = transportCall.facilityTypeCode;
      this.timestamp.publisherRole = this.globals.config.publisherRole;
      this.timestamp.publisher = this.globals.config.publisher;
      this.delayCode = this.transportCallFormGroup.controls.delayCode.value;
      this.timestamp.delayReasonCode = (this.delayCode ? this.delayCode.smdgCode : null);
      this.timestamp.remark = this.transportCallFormGroup.controls.defaultTimestampRemark.value;
      this.timestamp.vesselIMONumber = transportCall.vessel.vesselIMONumber;
      const locationName = this.transportCallFormGroup.controls.locationName.value;
      if (this.locationNameLabel && locationName) {
        this.timestamp.eventLocation = new class implements EventLocation {
          locationName: string
        }
        this.timestamp.eventLocation.locationName = locationName;
      }

      let date = this.transportCallFormGroup.controls.eventTimestampDate.value as Date;
      let time = this.transportCallFormGroup.controls.eventTimestampTime.value;
      let port = this.timestampMappingService.getPortByUnLocode(transportCall.UNLocationCode);
      this.timestamp.eventDateTime = this.dateToUTC.transform(date, time, port);

      this.timestamp.timestampType = this.timestampType as PortcallTimestampType;
      this.timestamp.portOfCall = this.timestampMappingService.getPortByUnLocode(transportCall.UNLocationCode);

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
