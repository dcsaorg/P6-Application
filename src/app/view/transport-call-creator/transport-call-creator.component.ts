import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {Port} from '../../model/portCall/port';
import {TransportCall} from '../../model/jit/transport-call';
import {FacilityTypeCode} from '../../model/enums/facilityTypeCodeOPR';
import {TransportCallService} from '../../controller/services/jit/transport-call.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import {VesselService} from '../../controller/services/base/vessel.service';
import {Vessel} from '../../model/portCall/vessel';
import {EventLocation} from '../../model/eventLocation';
import {PortService} from 'src/app/controller/services/base/port.service';
import {ErrorHandler} from 'src/app/controller/services/util/errorHandler';
import {Observable, take} from 'rxjs';
import {tap} from 'rxjs/operators';
import {TimestampEditorComponent} from '../timestamp-editor/timestamp-editor.component';
import {TimestampResponseStatus} from '../../model/enums/timestamp-response-status';

@Component({
  selector: 'app-add-transport-call',
  templateUrl: './transport-call-creator.component.html',
  styleUrls: ['./transport-call-creator.component.scss']
})
export class TransportCallCreatorComponent implements OnInit {
  transportCallFormGroup: FormGroup;
  portOfCall: Port;
  portOfCalls$: Observable<Port[]>;
  creationProgress: boolean;
  vessels$: Observable<Vessel[]>;
  selectedVessel: Vessel;
  createTimestampChecked: boolean;

  constructor(private formBuilder: FormBuilder,
              private translate: TranslateService,
              private dialogService: DialogService,
              public ref: DynamicDialogRef,
              private messageService: MessageService,
              private transportCallService: TransportCallService,
              private vesselService: VesselService,
              private portService: PortService,
              ) {
  }

  ngOnInit(): void {
    this.creationProgress = false;
    this.portOfCalls$ = this.portService.getPorts();
    this.transportCallFormGroup = this.formBuilder.group({
      timestampChecking: new FormControl(null),
      serviceCode: new FormControl(null, [Validators.required, Validators.maxLength(11)]),
      exportVoyageNumber: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
      importVoyageNumber: new FormControl(null, [Validators.maxLength(50)]),
      port: new FormControl(null, [Validators.required]),
      vessel: new FormControl(null, [Validators.required]),
    });
    this.vessels$ = this.loadVessels();
  }

  private loadVessels(): Observable<Vessel[]> {
    return this.vesselService.getVessels().pipe(
      // Retain the selection if it exists.  Trigger with editing the selected vessel
      tap(vessels => this.selectedVessel = vessels.find(v => v.vesselIMONumber === this.selectedVessel?.vesselIMONumber))
    );
  }

  close(): void {
    this.ref.close(null);
  }

  vesselSelected(): void {
    this.selectedVessel = this.transportCallFormGroup.controls.vessel.value;
  }


  proceedButtonText(): string {
    if (this.createTimestampChecked) {
      return 'general.portVisit.proceedToTimestampCreation';
    }
    return 'general.portVisit.create';
  }

  proceed(): void {
    if (this.creationProgress) {
      // It is sometimes possible to trigger multiple timestamps despite the
      // debounceClick and "disabled while creating"-feature
      return;
    }
    this.creationProgress = true;
    const port: Port = this.transportCallFormGroup.controls.port.value;
    const vessel: Vessel = this.transportCallFormGroup.controls.vessel.value;
    const carrierServiceCode: string = this.transportCallFormGroup.controls.serviceCode.value;
    const exportVoyageNumber: string = this.transportCallFormGroup.controls.exportVoyageNumber.value;
    const importVoyageNumber: string = this.transportCallFormGroup.controls.importVoyageNumber.value;
    const location: EventLocation = {
      UNLocationCode: port.UNLocationCode,
      facilityCode: null,
      facilityCodeListProvider: null
    };
    const transportCall: TransportCall = {
      UNLocationCode: port.UNLocationCode,
      carrierServiceCode: carrierServiceCode,
      exportVoyageNumber: exportVoyageNumber,
      importVoyageNumber: importVoyageNumber ?? exportVoyageNumber,
      carrierExportVoyageNumber: exportVoyageNumber,
      carrierImportVoyageNumber: importVoyageNumber ?? exportVoyageNumber,
      facilityTypeCode: FacilityTypeCode.POTE,
      transportCallSequenceNumber: 1,
      modeOfTransport: 'VESSEL',
      location: location,
      vessel: vessel
    };

    if (this.createTimestampChecked) {
      transportCall.portOfCall = port;
      this.dialogService.open(TimestampEditorComponent, {
        header: this.translate.instant('general.timestamp.create.label'),
        width: '75%',
        data: {
          transportCall: transportCall,
          timestampResponseStatus: TimestampResponseStatus.CREATE
        }
      }).onClose.pipe(take(1)).subscribe(ts => {
        this.creationProgress = false;
        if (ts) {
          this.ref.close(ts);
        }
      });
      return;
    }

    this.transportCallService.addTransportCall(transportCall).subscribe({
      next: transportCall => {
        this.creationProgress = false;
        this.messageService.add(
          {
            key: 'GenericSuccessToast',
            severity: 'success',
            summary: this.translate.instant('general.transportCall.validation.success.summary'),
            detail: this.translate.instant('general.transportCall.validation.success.detail')
          });
        this.ref.close(transportCall);
      },
      error: errorResponse => {
        this.creationProgress = false;
        const errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse);
        this.messageService.add(
          {
            key: 'GenericErrorToast',
            severity: 'error',
            summary: this.translate.instant('general.transportCall.validation.error.detail'),
            detail: errorMessage
          });
      }
    });
  }

}
