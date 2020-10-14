import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SelectItem} from "primeng/api";
import {Vessel} from "../model/vessel";
import {DialogService} from "primeng/dynamicdialog";
import {VesselEditorComponent} from "../vessel-editor/vessel-editor.component";
import {VesselService} from "../vessel.service";

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

  @Output() vesselNotifier: EventEmitter<boolean> = new EventEmitter<boolean>()

  ngOnInit(): void {
    this.updateVesselOptions(this.selectedVessel);
  }

  createNewVessel() {
    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: 'Create a new vessel',
      width: '50%'
    });
    vesselEditor.onClose.subscribe((result: Vessel) => {
      if (result) {
        this.updateVesselOptions(result);
      }
    })
  }

  editVessel() {
    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: 'Edit vessel',
      width: '50%',
      data: this.selectedVessel
    });
    vesselEditor.onClose.subscribe((result: Vessel) => {
      if (result) {
        this.updateVesselOptions(result);
      }
    })
  }

  selectVessel() {
    this.vesselService.getVessel(this.selectedVessel.id).subscribe(nextVessel => {
      this.selectedVessel = nextVessel;
      if (this.selectedVessel) {
        this.vesselNotifier.emit(true)
      } else {
        this.vesselNotifier.emit(false)
      }
    });
  }

  private updateVesselOptions(updatedVessel: Vessel) {
    this.vesselService.getVessels().subscribe(vessels => {
      this.vessels = [];
      this.vessels.push({label: 'Select Vessel', value: null});
      vessels = vessels.sort((vessel1, vessel2) => vessel1.name >= vessel2.name ? 1 : -1);
      vessels.forEach(vessel => {
        this.vessels.push({label: vessel.name + ' (' + vessel.imo + ')', value: vessel});
      });
      if (updatedVessel) {
        console.log(updatedVessel);
        console.log(this.vessels);
        this.selectedVessel = updatedVessel;
        this.vesselNotifier.emit(true)
      }
    });
  }
}
