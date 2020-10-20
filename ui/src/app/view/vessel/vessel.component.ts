import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SelectItem} from "primeng/api";
import {Vessel} from "../../model/vessel";
import {DialogService} from "primeng/dynamicdialog";
import {VesselEditorComponent} from "../vessel-editor/vessel-editor.component";
import {VesselService} from "../../controller/vessel.service";

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

  constructor(public dialogService: DialogService, private vesselService: VesselService) {
  }

  @Output() vesselNotifier: EventEmitter<number> = new EventEmitter<number>()

  ngOnInit(): void {
    this.updateVesselOptions();
  }

  createNewVessel() {
    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: 'Create a new vessel',
      width: '50%'
    });
    vesselEditor.onClose.subscribe((result: Vessel) => {
      if (result) {
        this.updateVesselOptions();
      }
    })
  }

  editVessel() {
    const selectedVessel: Vessel = {
      id: this.selectedVessel.id,
      imo: this.selectedVessel.imo,
      teu: this.selectedVessel.teu,
      name: this.selectedVessel.name,
      serviceNameCode: this.selectedVessel.serviceNameCode
    };
    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: 'Edit vessel',
      width: '50%',
      data: selectedVessel
    });
    vesselEditor.onClose.subscribe((result: Vessel) => {
      if (result) {
        this.updateVesselOptions();
        this.vesselService.getVessel(result.id).subscribe(nextVessel => {
          this.selectedVessel = nextVessel;
        });
      }
    })
  }

  selectVessel() {
    if (this.selectedVessel) {
      this.vesselService.getVessel(this.selectedVessel.id).subscribe(nextVessel => {
        this.selectedVessel = nextVessel;
        this.vesselNotifier.emit(this.selectedVessel.id)
      });
    } else {
      this.vesselNotifier.emit(-1)
    }
  }

  private updateVesselOptions() {
    this.vesselService.getVessels().subscribe(vessels => {
      this.vessels = [];
      this.vessels.push({label: 'Select Vessel', value: null});
      vessels.forEach(vessel => {
        this.vessels.push({label: vessel.name + ' (' + vessel.imo + ')', value: vessel});
      });
    });
  }
}
