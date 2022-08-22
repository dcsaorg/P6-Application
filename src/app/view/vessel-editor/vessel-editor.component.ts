import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Vessel } from "../../model/portCall/vessel";
import { Carrier } from "../../model/portCall/carrier";
import { VesselService } from "../../controller/services/base/vessel.service";
import { MessageService } from "primeng/api";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { vesselOperatorCarrierCodeListProvider } from '../../model/enums/vesselOperatorCarrierCodeListProvider';
import { SelectItem } from "primeng/api";
import { Globals } from "../../model/portCall/globals";
import { ErrorHandler } from 'src/app/controller/services/util/errorHandler';

@Component({
  selector: 'app-vessel-editor',
  templateUrl: './vessel-editor.component.html',
  styleUrls: ['./vessel-editor.component.scss']
})
export class VesselEditorComponent implements OnInit {
  vessel: Vessel;
  vesselFormGroup: FormGroup;
  carriers: SelectItem[];
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

    if (this.config.data) {
      this.allowImoID = false;
      this.vessel = this.config.data;
      this.vesselFormGroup.removeControl("imoId");

    } else {
      this.allowImoID = true;
      this.vessel = {
        vesselIMONumber: null,
        vesselName: null,
        vesselFlag: null,
        vesselOperatorCarrierCode: null,
      };
    }
  }

  saveVessel() {
    this.enforceCarrierCodeListProviderTypeSMDG(this.vessel);
    if (this.config.data) {
      this.vesselService.updateVessel(this.vessel).subscribe({
        next: () => {
          this.messageService.add({
            key: 'GenericSuccessToast',
            severity: 'success',
            summary: 'Successfully updated vessel',
            detail: ''
          });
          this.ref.close(this.vessel);
          this.vesselService.updateVesselsObserverable()
        },
        error: errorResponse => {
          let errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse);
          this.messageService.add({
            key: 'GenericErrorToast',
            severity: 'error',
            summary: 'Error while updating vessel',
            detail: errorMessage
          });
        }
      });
    } else {
      this.vesselService.addVessel(this.vessel).subscribe({
        next: (newVessel: Vessel) => {
          this.messageService.add({
            key: 'GenericSuccessToast',
            severity: 'success',
            summary: 'Successfully added vessel',
            detail: ''
          });
          this.ref.close(newVessel);
        }, error: errorResponse => {
          let errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse);
          this.messageService.add({
            key: 'GenericErrorToast',
            severity: 'error',
            summary: 'Error while adding vessel',
            detail: errorMessage
          });
        }
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
        this.carriers.push({ label: carrier.carrierName + ' (' + carrier.smdgCode + ')', value: carrier.smdgCode });
      });
    });
  }

  /* UI only supports this type (as of this comment - 18/07/22)
  Only enforced if a carrier is chosen
  */
  enforceCarrierCodeListProviderTypeSMDG(vessel: Vessel) {
    if (vessel.vesselOperatorCarrierCode) {
      vessel.vesselOperatorCarrierCodeListProvider = vesselOperatorCarrierCodeListProvider.SMDG
    }
  }
}
