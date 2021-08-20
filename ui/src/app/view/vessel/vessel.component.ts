import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SelectItem} from "primeng/api";
import {Vessel} from "../../model/portCall/vessel";
import {DialogService} from "primeng/dynamicdialog";
import {VesselEditorComponent} from "../vessel-editor/vessel-editor.component";
import {VesselService} from "../../controller/services/base/vessel.service";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.scss'],
  providers: [
    DialogService
  ]
})
export class VesselComponent implements OnInit {
  vessels: SelectItem[];
  selectedVessel: Vessel;

  @Output() vesselNotifier: EventEmitter<number> = new EventEmitter<number>()
  @Output() vesselSavedNotifier: EventEmitter<number> = new EventEmitter<number>()

  constructor(public dialogService: DialogService,
              private vesselService: VesselService,
              private messageService: MessageService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.updateVesselOptions();

    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateVesselOptions();
    });
  }

  createNewVessel() {
    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: this.translate.instant('general.vessel.add.header'),
      width: '50%'
    });
    vesselEditor.onClose.subscribe((result: Vessel) => {
      if (result) {
        this.updateVesselOptions();
        this.vesselSavedNotifier.emit(result.vesselIMONumber);
      }
    })
  }

  editVessel() {
    if (this.selectedVessel) {
    const selectedVessel: Vessel = {
      vesselIMONumber: this.selectedVessel.vesselIMONumber,
      vesselName: this.selectedVessel.vesselName,
      teu: this.selectedVessel.teu,
      vesselFlag: this.selectedVessel.vesselFlag,
      serviceNameCode: this.selectedVessel.serviceNameCode,
      vesselOperatorCarrierID: this.selectedVessel.vesselOperatorCarrierID,
      vesselCallSignNumber: this.selectedVessel.vesselCallSignNumber,
      vesselOperatorCarrierCode: this.selectedVessel.vesselOperatorCarrierCode,
      vesselOperatorCarrierCodeListProvider: this.selectedVessel.vesselOperatorCarrierCodeListProvider
    };


    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: this.translate.instant('general.vessel.edit.header'),
      width: '50%',
      data: selectedVessel
    });
  
    vesselEditor.onClose.subscribe((result: Vessel) => {
      if (result) {
        this.updateVesselOptions();
        this.vesselService.getVessel(result.vesselIMONumber).subscribe(nextVessel => {
          this.selectedVessel = nextVessel;
        });
      }
    })
  }
  else{
    this.messageService.add({
      key: 'vesselNotSelectedWarning',
      severity: 'warn',
      summary: 'You need to choose a vessel'
    });
  }
  }

  selectVessel() {
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
}
