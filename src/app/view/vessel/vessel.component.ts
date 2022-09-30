import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Vessel } from '../../model/portCall/vessel';
import { DialogService } from 'primeng/dynamicdialog';
import { VesselEditorComponent } from '../vessel-editor/vessel-editor.component';
import { VesselService } from '../../controller/services/base/vessel.service';
import { TranslateService } from '@ngx-translate/core';
import { TransportCallFilterService } from '../../controller/services/base/transport-call-filter.service';
import {BehaviorSubject, mergeMap, Observable, take} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.scss'],
  providers: [
    DialogService
  ]
})
export class VesselComponent implements OnInit {
  vessels$: Observable<Vessel[]>;
  selectedVessel: Vessel;

  constructor(
    public dialogService: DialogService,
    private vesselService: VesselService,
    private messageService: MessageService,
    private transportCallFilterService: TransportCallFilterService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.vessels$ = this.fetchVessels();
  }

  createNewVessel(): void {
    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: this.translate.instant('general.vessel.add.header'),
      width: '50%'
    });
    vesselEditor.onClose.subscribe((result: Vessel) => {
      if (result) {
        this.vesselService.vesselChanged(result);
      }
    });
  }

  editVessel(): void {
    if (this.selectedVessel) {
      const selectedVessel: Vessel = {
        vesselIMONumber: this.selectedVessel.vesselIMONumber,
        vesselName: this.selectedVessel.vesselName,
        vesselFlag: this.selectedVessel.vesselFlag,
        vesselOperatorCarrierCode: this.selectedVessel.vesselOperatorCarrierCode,
        vesselCallSignNumber: this.selectedVessel.vesselCallSignNumber,
        vesselOperatorCarrierCodeListProvider: this.selectedVessel.vesselOperatorCarrierCodeListProvider,
        type: this.selectedVessel.type,
        width: this.selectedVessel.width,
        length: this.selectedVessel.length,
        dimensionUnit: this.selectedVessel.dimensionUnit
      };

      const vesselEditor = this.dialogService.open(VesselEditorComponent, {
        header: this.translate.instant('general.vessel.edit.header'),
        width: '50%',
        data: selectedVessel
      });

      vesselEditor.onClose.pipe(take(1)).subscribe((result: Vessel) => {
        if (result) {
          this.vesselService.vesselChanged(result);
        }
      });
    }
    else {
      this.messageService.add({
        key: 'GenericErrorToast',
        severity: 'warn',
        summary: 'You need to choose a vessel'
      });
    }
  }

  selectVessel(vessel: Vessel): void {
    this.selectedVessel = vessel;
    this.transportCallFilterService.updateVesselFilter(this.selectedVessel);
  }

  private fetchVessels(): Observable<Vessel[]> {
    return this.vesselService.vesselChanged$.pipe(
      mergeMap(_ => this.vesselService.getVessels()),
      tap(vessels => {
        const selectedIMONumber = this.selectedVessel?.vesselIMONumber;
        const newSelectedVessel = vessels.find(v => v.vesselIMONumber === selectedIMONumber);
        // If there is a change, emit it as a new event
        if (this.selectedVessel !== newSelectedVessel) {
          this.transportCallFilterService.updateVesselFilter(this.selectedVessel);
        }
        this.selectedVessel = newSelectedVessel;
      })
    );
  }
}
