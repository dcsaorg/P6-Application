import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Vessel } from "../../model/portCall/vessel";
import { VesselService } from "../../controller/services/base/vessel.service";
import { MessageService } from "primeng/api";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { vesselOperatorCarrierCodeListProvider } from '../../model/enums/vesselOperatorCarrierCodeListProvider';
import { SelectItem } from "primeng/api";
import { Globals } from "../../model/portCall/globals";
import { ErrorHandler } from 'src/app/controller/services/util/errorHandler';
import { VesselType } from 'src/app/model/enums/vesselType';
import { DimensionUnit } from 'src/app/model/enums/dimensionUnit';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-vessel-editor',
  templateUrl: './vessel-editor.component.html',
  styleUrls: ['./vessel-editor.component.scss']
})
export class VesselEditorComponent implements OnInit {
  vessel: Vessel;
  vesselFormGroup: FormGroup;
  carriers: SelectItem[];
  vesselTypes: SelectItem[];
  dimensionUnits: SelectItem[];
  allowImoID: boolean;
  VesselType = VesselType;
  DimensionUnit = DimensionUnit;

  constructor(public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private vesselService: VesselService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    public globals: Globals,
    private translate: TranslateService
  ) {
  }

  ngOnInit(): void {
    this.vesselFormGroup = this.formBuilder.group({
      vesselIMONumber: new FormControl(null, [
        Validators.required, Validators.pattern('^\\d{7}$'), Validators.maxLength(7)]),
      vesselName: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(35)]),
      vesselFlag: new FormControl(null, [Validators.pattern('^\\w{2}?$')]),
      vesselCallSignNumber: new FormControl(null, [Validators.minLength(1), Validators.maxLength(10)]),
      vesselOperatorCarrierCode: new FormControl(null),
      length: new FormControl(null, [Validators.pattern('^[0-9]+(.[0-9]?)?$')]),
      width: new FormControl(null, [Validators.pattern('^[0-9]+(.[0-9]?)?$')]),
      type: new FormControl(null),
      dimensionUnit: new FormControl(null),
    });

    this.updateCarrierOptions();
    this.updateVesselTypeOptions();
    this.updateDimensionUnitOptions();

    if (this.config.data) {
      this.allowImoID = false;
      this.vessel = this.config.data;
      this.vesselFormGroup.patchValue(this.vessel);
      this.vesselFormGroup.removeControl("imoId");
    } else {
      this.allowImoID = true;
      this.vessel
    }
    this.toggleDimensionFields();
  }

  saveVessel() {
    this.vessel = {
      vesselIMONumber: this.vesselFormGroup.controls.vesselIMONumber.value,
      vesselName: this.vesselFormGroup.controls.vesselName.value,
      vesselFlag: this.vesselFormGroup.controls.vesselFlag.value,
      vesselCallSignNumber: this.vesselFormGroup.controls.vesselCallSignNumber.value,
      vesselOperatorCarrierCode: this.vesselFormGroup.controls.vesselOperatorCarrierCode.value,
      dimensionUnit: this.vesselFormGroup.controls.dimensionUnit.value,
      type: this.vesselFormGroup.controls.type.value
    };
    if(this.vessel.dimensionUnit){      
      this.vessel.width = this.vesselFormGroup.controls.width.value;
      this.vessel.length = this.vesselFormGroup.controls.length.value;
    }
    this.enforceCarrierCodeListProviderTypeSMDG();
    console.log(this.vessel);
    if (this.config.data) {
      this.vesselService.updateVessel(this.vessel).subscribe({
        next: () => {
          this.messageService.add({
            key: 'GenericSuccessToast',
            severity: 'success',
            summary: 'Successfully updated vessel'
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
      this.carriers.push({ label: this.translate.instant('general.carrier.select'), value: null });
      carriers.forEach(carrier => {
        this.carriers.push({ label: carrier.carrierName + ' (' + carrier.smdgCode + ')', value: carrier.smdgCode });
      });
    });
  }

  private updateVesselTypeOptions() {
    this.vesselTypes = [];
    this.vesselTypes.push({ label: this.translate.instant('general.vessel.vesselType.select'), value: null });
    for (var vesselType in this.VesselType) {
      this.vesselTypes.push({ label: vesselType, value: vesselType });
    }
  }

  private updateDimensionUnitOptions() {
    this.dimensionUnits = [];
    this.dimensionUnits.push({ label: this.translate.instant('general.vessel.dimensionUnit.select'), value: null });
    for (var dimensionUnit in this.DimensionUnit) {
      this.dimensionUnits.push({ label: dimensionUnit, value: dimensionUnit });
    }
  }

  hasDimensionUnit() {
    return this.vesselFormGroup.controls?.dimensionUnit.value ?? null;
  }

  toggleDimensionFields() {
    if (this.vesselFormGroup.controls.dimensionUnit.value) {
      this.vesselFormGroup.controls.length.enable();
      this.vesselFormGroup.controls.width.enable();
    } else {
      this.vesselFormGroup.controls.length.disable();
      this.vesselFormGroup.controls.width.disable();
    }
    this.vesselFormGroup.controls.length.updateValueAndValidity();
    this.vesselFormGroup.controls.width.updateValueAndValidity();
  }

  /* UI only supports SMDG CarrierCodeListProvider
    Only enforced if a carrier is chosen
  */
  private enforceCarrierCodeListProviderTypeSMDG() {
    if (this.vesselFormGroup.controls?.vesselOperatorCarrierCode.value) {
      this.vessel.vesselOperatorCarrierCodeListProvider = vesselOperatorCarrierCodeListProvider.SMDG
    }
  }
}
