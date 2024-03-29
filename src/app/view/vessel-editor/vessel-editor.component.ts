import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Vessel} from '../../model/portCall/vessel';
import {VesselService} from '../../controller/services/base/vessel.service';
import {MessageService, SelectItem} from 'primeng/api';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {vesselOperatorCarrierCodeListProvider} from '../../model/enums/vesselOperatorCarrierCodeListProvider';
import {Globals} from '../../model/portCall/globals';
import {ErrorHandler} from 'src/app/controller/services/util/errorHandler';
import {VesselType} from 'src/app/model/enums/vesselType';
import {DimensionUnit} from 'src/app/model/enums/dimensionUnit';
import {TranslateService} from '@ngx-translate/core';
import {Observable, take} from 'rxjs';
import {Carrier} from '../../model/portCall/carrier';
import {tap} from 'rxjs/operators';

interface IMOValidationErrors {
  minLength: boolean;
  maxLength: boolean;
  digitsOnly: boolean;
  checkDigit: boolean;
  computedCheckDigit: number;
}

const intDigitsOnly: RegExp = /^[0-9]+$/;

const IMOValidatorFn: ValidatorFn = (control: AbstractControl) => {
  const value: string = control.value;
  if (! value) {
    return null;
  }

  if (value.length !== 7 || !intDigitsOnly.test(value)) {
    return {
      vesselIMONumber: {
        minLength: value.length < 7,
        maxLength: value.length > 7,
        digitsOnly: !intDigitsOnly.test(value),
        checkDigit: false,
        computedCheckDigit: -1,
      } as IMOValidationErrors
    };
  }
  const expectedCheckDigit = parseInt(value.charAt(6), 10);
  let actualCheckDigit = 0;
  for (let i = 0 ; i < 6 ; i++) {
    actualCheckDigit += parseInt(value.charAt(i), 10) * (7 - i);
  }
  actualCheckDigit %= 10;
  if (actualCheckDigit !== expectedCheckDigit) {
    return {
      vesselIMONumber: {
        minLength: false,
        maxLength: false,
        digitsOnly: false,
        checkDigit: true,
        computedCheckDigit: actualCheckDigit
      } as IMOValidationErrors
    };
  }
  return null;
};


@Component({
  selector: 'app-vessel-editor',
  templateUrl: './vessel-editor.component.html',
  styleUrls: ['./vessel-editor.component.scss']
})
export class VesselEditorComponent implements OnInit {
  vessel: Vessel;
  vesselFormGroup: FormGroup;
  carriers$: Observable<Carrier[]>;
  vesselTypes: SelectItem[];
  dimensionUnits: SelectItem[];
  allowImoID: boolean;
  creationProgress = false;
  VesselType = VesselType;
  DimensionUnit = DimensionUnit;

  constructor(
    public ref: DynamicDialogRef,
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
        Validators.required, IMOValidatorFn]),
      vesselName: new FormControl(null, [Validators.required, Validators.minLength(1), Validators.maxLength(35)]),
      vesselFlag: new FormControl(null, [Validators.pattern('^\\w{2}?$')]),
      vesselCallSignNumber: new FormControl(null, [Validators.minLength(1), Validators.maxLength(10)]),
      vesselOperatorCarrierCode: new FormControl(null),
      length: new FormControl(null, [Validators.pattern('^[0-9]+([.][0-9]?)?$')]),
      width: new FormControl(null, [Validators.pattern('^[0-9]+([.][0-9]?)?$')]),
      type: new FormControl(null),
      dimensionUnit: new FormControl(null),
    });

    if (this.config.data) {
      this.allowImoID = false;
      this.vessel = this.config.data;
      this.vesselFormGroup.patchValue(this.vessel);
      if (this.vessel.dimensionUnit) {
        // we disable if dimensionUnit is set once.
        this.vesselFormGroup.controls.dimensionUnit.disable();
      }
    } else {
      this.allowImoID = true;
    }
    this.updateVesselTypeOptions();
    this.updateDimensionUnitOptions();
    this.carriers$ = this.fetchCarriers();
    this.toggleDimensionFields();
  }

  private fetchCarriers(): Observable<Carrier[]> {
    return this.vesselService.getCarriers()
      .pipe(
        tap(carriers => {
          const selectedCarrier = carriers.find(c => c.smdgCode === this.vessel?.vesselOperatorCarrierCode);
          const operatorForm = this.vesselFormGroup.controls.vesselOperatorCarrierCode;
          if (operatorForm.pristine) {
            operatorForm.setValue(selectedCarrier);
            operatorForm.updateValueAndValidity();
          }
        }),
      );
  }

  saveVessel(): void {
    if (this.creationProgress) {
      return;
    }
    this.creationProgress = true;
    this.vessel = {
      vesselIMONumber: this.vesselFormGroup.controls.vesselIMONumber.value,
      vesselName: this.vesselFormGroup.controls.vesselName.value,
      vesselFlag: this.vesselFormGroup.controls.vesselFlag.value,
      vesselCallSignNumber: this.vesselFormGroup.controls.vesselCallSignNumber.value,
      vesselOperatorCarrierCode: this.vesselFormGroup.controls.vesselOperatorCarrierCode.value?.smdgCode,
      dimensionUnit: this.vesselFormGroup.controls.dimensionUnit.value,
      type: this.vesselFormGroup.controls.type.value
    };
    if (this.vessel.dimensionUnit) {
      this.vessel.width = this.vesselFormGroup.controls.width.value;
      this.vessel.length = this.vesselFormGroup.controls.length.value;
    }
    this.enforceCarrierCodeListProviderTypeSMDG();
    if (this.config.data) {
      this.vesselService.updateVessel(this.vessel).pipe(take(1)).subscribe({
        next: (vessel) => {
          this.creationProgress = false;
          this.messageService.add({
            key: 'GenericSuccessToast',
            severity: 'success',
            summary: 'Successfully updated vessel'
          });
          this.vessel = vessel;
          this.ref.close(this.vessel);
          this.vesselService.vesselChanged(this.vessel);
        },
        error: errorResponse => {
          this.creationProgress = false;
          const errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse);
          this.messageService.add({
            key: 'GenericErrorToast',
            severity: 'error',
            summary: 'Error while updating vessel',
            detail: errorMessage
          });
        }
      });
    } else {
      this.vesselService.addVessel(this.vessel).pipe(take(1)).subscribe({
        next: (newVessel: Vessel) => {
          this.messageService.add({
            key: 'GenericSuccessToast',
            severity: 'success',
            summary: 'Successfully added vessel',
            detail: ''
          });
          this.ref.close(newVessel);
        }, error: errorResponse => {
          const errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse);
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

  cancel(): void {
    this.ref.close(null);
  }

  private updateVesselTypeOptions(): void {
    this.vesselTypes = [];
    this.vesselTypes.push({ label: this.translate.instant('general.vessel.vesselType.select'), value: null });
    for (const vesselType in this.VesselType) {
      this.vesselTypes.push({ label: vesselType, value: vesselType });
    }
  }

  private updateDimensionUnitOptions(): void {
    this.dimensionUnits = [];
    this.dimensionUnits.push({ label: this.translate.instant('general.vessel.dimensionUnit.select'), value: null });
    for (const dimensionUnit in this.DimensionUnit) {
      this.dimensionUnits.push({ label: dimensionUnit, value: dimensionUnit });
    }
  }

  hasDimensionUnit(): boolean {
    return !!this.vesselFormGroup.controls?.dimensionUnit.value;
  }

  toggleDimensionFields(): void {
    const lengthControl = this.vesselFormGroup.controls.length;
    const widthControl = this.vesselFormGroup.controls.width;
    if (this.vesselFormGroup.controls.dimensionUnit.value) {
      lengthControl.enable();
      widthControl.enable();
    } else {
      lengthControl.disable();
      lengthControl.setValue(null);
      widthControl.disable();
      widthControl.setValue(null);
    }
    lengthControl.updateValueAndValidity();
    widthControl.updateValueAndValidity();
  }

  /* UI only supports SMDG CarrierCodeListProvider */
  private enforceCarrierCodeListProviderTypeSMDG(): void {
    if (this.vessel.vesselOperatorCarrierCode) {
      this.vessel.vesselOperatorCarrierCodeListProvider = vesselOperatorCarrierCodeListProvider.SMDG;
    } else {
      this.vessel.vesselOperatorCarrierCodeListProvider = null;
    }
  }
}
