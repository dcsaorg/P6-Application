import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Vessel} from "../../model/portCall/vessel";
import {VesselService} from "../../controller/services/base/vessel.service";
import {MessageService} from "primeng/api";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-vessel-editor',
  templateUrl: './vessel-editor.component.html',
  styleUrls: ['./vessel-editor.component.scss']
})
export class VesselEditorComponent implements OnInit {
  vessel: Vessel;
  vesselFormGroup: FormGroup;

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private vesselService: VesselService,
              private messageService: MessageService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    if (this.config.data) {
      this.vessel = this.config.data;
    } else {
      this.vessel = {vesselIMONumber: null, vesselName: "", vesselOperatorCarrierID: null, teu: null, serviceNameCode: "", vesselFlag: "", vesselCallSignNumber: ""};
    }

    this.vesselFormGroup = this.formBuilder.group({
      imoId: new FormControl(null, [
        Validators.required, Validators.pattern('^\\d{7}$'), Validators.maxLength(7)
      ]),
      flag: new FormControl(null, [
        Validators.minLength(2), Validators.maxLength(2)
      ]),
      name: new FormControl(null, [
        Validators.required, Validators.minLength(1), Validators.maxLength(100)]),
      callSignNumber: new FormControl(null, [
        Validators.required, Validators.min(1), Validators.max(32767)
      ]),
      operatorCarrierID: new FormControl(null, [
        Validators.maxLength(255)
      ]),
    });
  }

  saveVessel() {
    if (this.config.data) {
      this.vesselService.updateVessel(this.vessel).subscribe(() => {
        this.messageService.add({
          key: 'vesselUpdateSuccess',
          severity: 'success',
          summary: 'Successfully updated vessel',
          detail: ''
        });
        this.ref.close(this.vessel);
      }, response => {
        this.messageService.add({
          key: 'vesselUpdateError',
          severity: 'error',
          summary: 'Error while updating vessel',
          detail: response.error.message
        });
      });
    } else {
      this.vesselService.addVessel(this.vessel).subscribe((newVessel: Vessel) => {
        this.messageService.add({
          key: 'vesselAddSuccess',
          severity: 'success',
          summary: 'Successfully added vessel',
          detail: ''
        });
        this.ref.close(newVessel);
      }, response => {
        this.messageService.add({
          key: 'vesselAddError',
          severity: 'error',
          summary: 'Error while adding vessel',
          detail: response.error.message + ': ' + response.error.errors
        });
      });

    }
  }

  cancel() {
    this.ref.close(null);
  }
}
