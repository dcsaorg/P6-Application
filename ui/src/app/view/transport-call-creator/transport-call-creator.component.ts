import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../model/portCall/globals";
import {MessageService, SelectItem} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {Port} from "../../model/portCall/port";
import {TransportCall} from "../../model/OVS/transport-call";
import {Transport} from "../../model/OVS/transport";
import {FacilityCodeType} from "../../model/OVS/facilityCodeType";
import {Terminal} from "../../model/portCall/terminal";
import {TransportCallService} from "../../controller/services/OVS/transport-call.service";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {Vessel} from "../../model/portCall/vessel";
import {VesselService} from "../../controller/services/base/vessel.service";

@Component({
  selector: 'app-add-transport-call',
  templateUrl: './transport-call-creator.component.html',
  styleUrls: ['./transport-call-creator.component.scss']
})
export class TransportCallCreatorComponent implements OnInit {
  transportCallFormGroup: FormGroup;
  portOfCall: Port;
  loadTerminalOptions: SelectItem[] = [];
  dischargeTerminalOptions: SelectItem[] = [];
  portOptions: SelectItem[] = [];
  creationProgress: boolean;
  selectedVessel: Vessel;
  vessels: SelectItem[];

  @Output() vesselNotifier: EventEmitter<number> = new EventEmitter<number>()
  @Output() vesselSavedNotifier: EventEmitter<number> = new EventEmitter<number>()

  constructor(private formBuilder: FormBuilder,
              private translate: TranslateService,
              private vesselService: VesselService,
              private globals: Globals,
              public ref: DynamicDialogRef,
              private messageService: MessageService,
              private transportCallService: TransportCallService) {
  }

  ngOnInit(): void {
    this.creationProgress = false;
    this.updatePortOptions();
    this.updateVesselOptions();
    this.transportCallFormGroup = this.formBuilder.group({
      transportName: new FormControl(null, [
        Validators.required, Validators.maxLength(100)]),
      transportReference: new FormControl(null, [
        Validators.required, Validators.maxLength(50)]),

      loadPort: new FormControl(null, [
        Validators.required]),
      loadTerminal: new FormControl({value: '', disabled: true}, [
        Validators.required]),

      dischargePort: new FormControl(null, [
        Validators.required]),
      dischargeTerminal: new FormControl({value: '', disabled: true}, [
        Validators.required]),

      vessel: new FormControl({value: '', disabled: false}, [
        Validators.required]),

      loadCallSequenceNumber: new FormControl(null, [
        Validators.required, Validators.pattern("^\\d+$"), Validators.min(1), Validators.max(2147483647)]),

      dischargeCallSequenceNumber: new FormControl(null, [
        Validators.required, Validators.pattern("^\\d+$"), Validators.min(1), Validators.max(2147483647)])

    });
  }

  close() {
    this.ref.close(null);
  }

  private updateTerminalOptions(isDischarge: boolean) {
    if (!isDischarge) {
      this.loadTerminalOptions = [];
      this.loadTerminalOptions.push({label: this.translate.instant('general.terminal.select'), value: null});
      this.globals.terminals.forEach(terminal => {
        if (this.portOfCall.id == terminal.port) {
          this.loadTerminalOptions.push({label: terminal.smdgCode, value: terminal})
        }
      })
    } else {
      this.dischargeTerminalOptions = [];
      this.dischargeTerminalOptions.push({label: this.translate.instant('general.terminal.select'), value: null});
      this.globals.terminals.forEach(terminal => {
        if (this.portOfCall.id == terminal.port) {
          this.dischargeTerminalOptions.push({label: terminal.smdgCode, value: terminal})
        }
      })
    }
  }

  selectVessel() {
    console.log(this.selectedVessel);
    if (this.selectedVessel) {
      this.vesselService.getVessel(this.selectedVessel.vesselIMONumber).subscribe(nextVessel => {
        this.selectedVessel = nextVessel;
        this.vesselNotifier.emit(this.selectedVessel.vesselIMONumber)
      });
    } else {
      this.vesselNotifier.emit(-1)
    }
  }

  private updateVesselOptions() {
    this.vesselService.getVessels().subscribe(vessels => {
      this.vessels = [];
      this.vessels.push({label: this.translate.instant('general.vessel.select'), value: null});
      vessels.forEach(vessel => {
        this.vessels.push({label: vessel.vesselName + ' (' + vessel.vesselIMONumber + ')', value: vessel});
      });
    });
  }

  portSelected(isDischarge: boolean) {
    if (!isDischarge && this.transportCallFormGroup.controls.loadPort.value) {
      this.portOfCall = this.transportCallFormGroup.controls.loadPort.value;
      this.transportCallFormGroup.controls.loadTerminal.enable();
      this.updateTerminalOptions(isDischarge);
    }
    if (isDischarge && this.transportCallFormGroup.controls.dischargePort.value) {
      this.portOfCall = this.transportCallFormGroup.controls.dischargePort.value;
      this.transportCallFormGroup.controls.dischargeTerminal.enable();
      this.updateTerminalOptions(isDischarge);
    }
  }

  private updatePortOptions() {
    this.portOptions.push({label: this.translate.instant('general.port.select'), value: null});
    this.globals.ports.forEach(port => {
      this.portOptions.push({label: port.unLocode, value: port});
    })
  }

  saveNewTransportCall() {
    this.creationProgress = true;

    let transport: Transport = new class implements Transport {
      transportName: string;
      vessel: Vessel;
      dischargeTransportCall: TransportCall;
      loadTransportCall: TransportCall;
      transportReference: string;
    }

    let dischargeTransportCall: TransportCall = new class implements TransportCall {
      UNLocationCode: string;
      carrierServiceCode: string;
      carrierVoyageNumber: string;
      facilityCode: string;
      facilityTypeCode: FacilityCodeType;
      otherFacility: string;
      sequenceColor: string;
      transportCallID: string;
      transportCallSequenceNumber: number;
      vesselIMONumber: string;
      vesselName: string;
      facilityCodeListProvider: string;
    }

    let loadTransportCall: TransportCall = new class implements TransportCall {
      UNLocationCode: string;
      carrierServiceCode: string;
      carrierVoyageNumber: string;
      facilityCode: string;
      facilityTypeCode: FacilityCodeType;
      otherFacility: string;
      sequenceColor: string;
      transportCallID: string;
      transportCallSequenceNumber: number;
      vesselIMONumber: string;
      vesselName: string;
      facilityCodeListProvider: string;
    }

    const dischargeTerminal: Terminal = this.transportCallFormGroup.controls.dischargeTerminal.value
    const dischargePort: Port = this.transportCallFormGroup.controls.dischargePort.value

    // dischargeTransportCall.facilityTypeCode = FacilityCodeType.POTE;
    dischargeTransportCall.UNLocationCode = dischargePort.unLocode;
    dischargeTransportCall.facilityCode = dischargeTerminal.smdgCode
    // dischargeTransportCall.facilityCode = dischargePort.unLocode + dischargeTerminal.smdgCode;
    dischargeTransportCall.transportCallSequenceNumber = this.transportCallFormGroup.controls.dischargeCallSequenceNumber.value
    dischargeTransportCall.facilityCodeListProvider = "SMDG";

    const loadTerminal: Terminal = this.transportCallFormGroup.controls.loadTerminal.value
    const loadPort: Port = this.transportCallFormGroup.controls.loadPort.value

    // loadTransportCall.facilityTypeCode = FacilityCodeType.POTE;
    loadTransportCall.UNLocationCode = loadPort.unLocode;
    loadTransportCall.facilityCode = loadTerminal.smdgCode
    // loadTransportCall.facilityCode = loadPort.unLocode + loadTerminal.smdgCode;
    loadTransportCall.transportCallSequenceNumber = this.transportCallFormGroup.controls.loadCallSequenceNumber.value
    loadTransportCall.facilityCodeListProvider = "SMDG";

    transport.dischargeTransportCall = dischargeTransportCall;
    transport.loadTransportCall = loadTransportCall;
    transport.vessel = this.selectedVessel;
    transport.transportName = this.transportCallFormGroup.controls.transportName.value;
    transport.transportReference = this.transportCallFormGroup.controls.transportReference.value;


    this.transportCallService.addTransport(transport).subscribe(transportCall => {
        this.creationProgress = false;

        this.messageService.add(
          {
            key: 'TransportcallAddSuccess',
            severity: 'success',
            summary: this.translate.instant('general.transportCall.validation.success.summery'),
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
            summary: this.translate.instant('general.transportCall.validation.error.summery'),
            detail: this.translate.instant('general.transportCall.validation.error.detail') + error.message
          });

      })
  }

}
