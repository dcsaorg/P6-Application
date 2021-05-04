import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Globals} from "../../model/portCall/globals";
import {MessageService, SelectItem} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";
import {Port} from "../../model/portCall/port";
import {TransportCall} from "../../model/OVS/transport-call";
import {FacilityCodeType} from "../../model/OVS/facilityCodeType";
import {Schedule} from "../../model/OVS/schedule";
import {Terminal} from "../../model/portCall/terminal";
import {TransportCallService} from "../../controller/services/OVS/transport-call.service";
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {Vessel} from "../../model/OVS/vessel";

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
  creationProgress: boolean;

  constructor(private formBuilder: FormBuilder,
              private translate: TranslateService,
              private globals: Globals,
              public ref: DynamicDialogRef,
              private messageService: MessageService,
              private transportCallService: TransportCallService) {
  }

  ngOnInit(): void {
    this.creationProgress = false;
    this.updatePortOptions();
    this.transportCallFormGroup = this.formBuilder.group({
      imo: new FormControl(null, [
        Validators.required, Validators.pattern('^\\d{7}$'), Validators.maxLength(7)]),
      port: new FormControl(null, [
        Validators.required]),
      terminal: new FormControl({value: '', disabled: true}, [
        Validators.required]),
      callSequenceNumber: new FormControl(null, [
        Validators.required, Validators.min(1), Validators.max(2147483647)])

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

  private updatePortOptions() {
    this.portOptions.push({label: this.translate.instant('general.port.select'), value: null});
    this.globals.ports.forEach(port => {
      this.portOptions.push({label: port.unLocode, value: port});
    })
  }

  saveNewTransportCall() {
    this.creationProgress = true;
    let transportCall: TransportCall = new class implements TransportCall {
      UNLocationCode: string;
      carrierServiceCode: string;
      carrierVoyageNumber: string;
      facilityCode: string;
      facilityTypeCode: FacilityCodeType;
      otherFacility: string;
      scheduleID: Schedule | string;
      sequenceColor: string;
      transportCallID: string;
      transportCallSequenceNumber: number;
      vessel: Vessel;
    }

    let vessel: Vessel = new class implements Vessel {
      vesselCallSignNumber: String;
      vesselFlag: String;
      vesselIMONumber: String;
      vesselName: String;
    }

    const terminal: Terminal = this.transportCallFormGroup.controls.terminal.value
    const port: Port = this.transportCallFormGroup.controls.port.value

    vessel.vesselIMONumber = this.transportCallFormGroup.controls.imo.value;
    transportCall.facilityTypeCode = FacilityCodeType.POTE;
    transportCall.facilityCode = port.unLocode + terminal.smdgCode;
    transportCall.vessel = vessel;
    transportCall.transportCallSequenceNumber = this.transportCallFormGroup.controls.callSequenceNumber.value

    this.transportCallService.addTransportCall(transportCall).subscribe(transportCall => {
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
