import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Vessel} from "../../model/portCall/vessel";
import {Carrier} from "../../model/portCall/carrier";
import {VesselService} from "../../controller/services/base/vessel.service";
import {MessageService} from "primeng/api";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {vesselOperatorCarrierCodeListProvider} from '../../model/enums/vesselOperatorCarrierCodeListProvider';
import {SelectItem} from "primeng/api";
import {Globals} from "../../model/portCall/globals";

@Component({
  selector: 'app-vessel-editor',
  templateUrl: './vessel-editor.component.html',
  styleUrls: ['./vessel-editor.component.scss']
})
export class VesselEditorComponent implements OnInit {
  vessel: Vessel;
  vesselFormGroup: FormGroup;
  carriers: SelectItem[];
  selectedCarrier: Carrier;
  allowImoID: boolean;


  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private vesselService: VesselService,
              private messageService: MessageService,
              private formBuilder: FormBuilder,
              public globals: Globals,
  ) {
  }


  ngOnInit(): void {
    this.vesselFormGroup = this.formBuilder.group({
      imoId: new FormControl(null, [
        Validators.required, Validators.pattern('^\\d{7}$'), Validators.maxLength(7)
      ]),
      flag: new FormControl(null, [
        Validators.pattern('^\\w{2}?$')
      ]),
      name: new FormControl(null, [
        Validators.required, Validators.minLength(1), Validators.maxLength(35)
      ]),
      callSignNumber: new FormControl(null, [
        Validators.minLength(1), Validators.maxLength(10)
      ]),
      operatorCarrierID: new FormControl(null, [
        Validators.maxLength(36)
      ]),
    });

    this.updateCarrierOptions();
    this.selectCarrier();

    if (this.config.data) {
      this.allowImoID = false;
      this.vessel = this.config.data;
      this.vesselFormGroup.removeControl("imoId");

    } else {
      this.allowImoID = true;
      this.vessel = {
        id: null,
        vesselIMONumber: null,
        vesselName: "",
        teu: null,
        serviceNameCode: "",
        vesselFlag: "",
        vesselOperatorCarrierCode: "",
        vesselOperatorCarrierCodeListProvider: vesselOperatorCarrierCodeListProvider.SMDG,
        vesselCallSignNumber: "",
        type: "",
        width: null,
        length: null
      };
    }

  }

  saveVessel() {
    this.selectCarrier();
    if (this.config.data) {
      this.vesselService.updateVessel(this.vessel).subscribe(() => {
        this.messageService.add({
          key: 'vesselUpdateSuccess',
          severity: 'success',
          summary: 'Successfully updated vessel',
          detail: ''
        });
        this.ref.close(this.vessel);
        this.vesselService.updateVesselsObserverable()
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

  private updateCarrierOptions() {
    this.vesselService.getcarriers().subscribe(carriers => {
      this.carriers = [];

      carriers.forEach(carrier => {
        this.carriers.push({label: carrier.carrierName + ' (' + carrier.smdgCode + ')', value: carrier.smdgCode});
      });
    });
  }

  selectCarrier() {

    // Check that a carirrier is chosen before allowing creation

  }
}
