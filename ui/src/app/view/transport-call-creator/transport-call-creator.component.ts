import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, RequiredValidator, Validators} from "@angular/forms";
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
import moment from "moment";

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
  facilityTypeCodeOptions: SelectItem[] = [];
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
    this.updateFacilityTypeCode();
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
      facilityTypeCode: new FormControl(null),

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

  private updateFacilityTypeCode() {
    this.facilityTypeCodeOptions.push({label: this.translate.instant('general.facilityTypeCode.select'), value: null});
    this.facilityTypeCodeOptions.push({label: FacilityTypeCode.PBPL.toString(), value: FacilityTypeCode.PBPL});
    this.facilityTypeCodeOptions.push({label: FacilityTypeCode.BRTH.toString(), value: FacilityTypeCode.BRTH});
  }

  updateTimestampTypeOptions() {
    this.timestampTypes = [];
    this.timestampTypes.push({label: this.translate.instant('general.timestamp.select'), value: null});
    for (let item in PortcallTimestampType) {
      this.timestampTypes.push({label: PortcallTimestampType[item], value: item})
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
    this.transportCallFormGroup.controls.eventTimestampDate.setValue(this.eventTimestampDate);
    this.transportCallFormGroup.controls.eventTimestampTime.setValue(this.eventTimestampTime);
  }

  shouldCreateTimestamp(): boolean {
    return this.timestampchecking;
  }

  canCreateTimestamp(): boolean {
    this.timestampType = this.transportCallFormGroup.controls.timestampType.value;
    return this.transportCallFormGroup.controls.facilityTypeCode.value && this.timestampType != null && this.transportCallFormGroup.controls.eventTimestampDate.value && this.transportCallFormGroup.controls.eventTimestampTime.value;
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
    transportCall.facilityTypeCode = this.transportCallFormGroup.controls.facilityTypeCode.value;

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
      this.timestamp.delayReasonCode = (this.delayCode ? this.delayCode.smdgCode : null);
      this.timestamp.remark = this.transportCallFormGroup.controls.defaultTimestampRemark.value;
      this.timestamp.vesselIMONumber = transportCall.vessel.vesselIMONumber;

      let port = this.timestampMappingService.getPortByUnLocode(transportCall.UNLocationCode);

      // Convert submitted date-time to timezone according to selected port of call
      let d = new Date(this.transportCallFormGroup.controls.eventTimestampDate.value);
      let month = String((d.getMonth() + 1)).padStart(2, '0');
      let day = String(d.getDate()).padStart(2, '0');
      let [hour, minute] = this.transportCallFormGroup.controls.eventTimestampTime.value.split(':');
      let second = String(d.getSeconds()).padStart(2, '0');
      this.timestamp.eventDateTime = moment.tz(`${d.getFullYear()}-${month}-${day} ${hour}:${minute}:${second}`, port.timezone).toISOString();

      this.timestamp.timestampType = PortcallTimestampType[this.transportCallFormGroup.controls.timestampType.value];
      this.timestamp.portOfCall = this.timestampMappingService.getPortByUnLocode(transportCall.UNLocationCode);

      this.creationProgress = true;
      this.timestampMappingService.addPortCallTimestamp(this.timestamp).subscribe(respTimestamp => {
          this.creationProgress = false;
          this.messageService.add(
            {
              key: 'TimestampAddSuccess',
              severity: 'success',
              summary: this.translate.instant('general.save.editor.success.summary'),
              detail: this.translate.instant('general.save.editor.success.detail')
            })
          this.ref.close(respTimestamp);
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
