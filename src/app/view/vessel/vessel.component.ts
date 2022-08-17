import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SelectItem} from "primeng/api";
import {Vessel} from "../../model/portCall/vessel";
import {DialogService} from "primeng/dynamicdialog";
import {VesselEditorComponent} from "../vessel-editor/vessel-editor.component";
import {VesselService} from "../../controller/services/base/vessel.service";
import {LangChangeEvent, TranslateService} from "@ngx-translate/core";
import {MessageService} from "primeng/api";
import {TransportCallFilterService} from "../../controller/services/base/transport-call-filter.service";

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

  @Output() vesselNotifier: EventEmitter<string> = new EventEmitter<string>()
  @Output() vesselSavedNotifier: EventEmitter<string> = new EventEmitter<string>()

  constructor(public dialogService: DialogService,
              private vesselService: VesselService,
              private messageService: MessageService,
              private transportCallFilterService: TransportCallFilterService,
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
      id: this.selectedVessel.id,
      vesselIMONumber: this.selectedVessel.vesselIMONumber,
      vesselName: this.selectedVessel.vesselName,
      teu: this.selectedVessel.teu,
      vesselFlag: this.selectedVessel.vesselFlag,
      vesselOperatorCarrierID: this.selectedVessel.vesselOperatorCarrierID,
      vesselCallSignNumber: this.selectedVessel.vesselCallSignNumber,
      vesselOperatorCarrierCode: this.selectedVessel.vesselOperatorCarrierCode,
      vesselOperatorCarrierCodeListProvider: this.selectedVessel.vesselOperatorCarrierCodeListProvider,
      type: this.selectedVessel.type,
      width: this.selectedVessel.width,
      length: this.selectedVessel.length
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
        this.transportCallFilterService.updateVesselFilter(this.selectedVessel);
      });
    } else {
      this.vesselNotifier.emit(null)
      this.transportCallFilterService.updateVesselFilter(null);
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
