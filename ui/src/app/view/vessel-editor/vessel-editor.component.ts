import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Vessel} from "../../model/portCall/vessel";
import {Carrier} from "../../model/portCall/carrier";
import {VesselService} from "../../controller/services/base/vessel.service";
import {MessageService} from "primeng/api";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {VesselComponent} from "../../view/vessel/vessel.component"
import { VesselIdToVesselPipe } from 'src/app/controller/pipes/vesselid-to-vessel.pipe';
import {SelectItem} from "primeng/api";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";

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
  

  constructor(public ref: DynamicDialogRef,
              public config: DynamicDialogConfig,
              private vesselService: VesselService,
              private messageService: MessageService,
              private translate: TranslateService,
              private formBuilder: FormBuilder) {
  }



  ngOnInit(): void {
    if (this.config.data) {
      this.vessel = this.config.data;
      console.log(this.vessel)
    } else {
      this.vessel = {vesselIMONumber: null, vesselName: "", teu: null, serviceNameCode: "", vesselFlag: "PA", vesselOperatorCarrierCode: "", vesselOperatorCarrierCodeListProvider: null, vesselCallSignNumber: ""};
    }


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
        Validators.required, Validators.minLength(1), Validators.maxLength(10)
      ]),
      operatorCarrierID: new FormControl(null, [
        Validators.maxLength(36)
      ]),
    });

    this.updatCarrrierOptions();
    this.selectCarrier();
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

  private updatCarrrierOptions() {
    this.vesselService.getcarriers().subscribe(carriers => {
      this.carriers = [];

      console.log(this.carriers);
      
      carriers.forEach(carrier => {
        this.carriers.push({label: carrier.carrierName + ' (' + carrier.smdgCode + ')', value: carrier.smdgCode}); 
      });
    });
  }
  selectCarrier() {

  //  if (this.selectedCarrier && Select) {   // Check that these are fullfilled before moving on

  }
}
