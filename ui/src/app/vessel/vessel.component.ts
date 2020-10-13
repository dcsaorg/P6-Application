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
    this.vessels = [];
    this.vessels.push({label: 'Select Vessel', value: null});
    this.vesselService.getVessels().forEach(vessel => {
      this.vessels.push({label: vessel.name, value: vessel})
    })

  }

  createNewVessel() {
    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: 'Create a new vessel',
      width: '50%'
    });
    vesselEditor.onClose.subscribe()
  }

  editVessel() {
    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: 'Edit vessel',
      width: '50%',
      data: this.selectedVessel
    });
    vesselEditor.onClose.subscribe()
  }

  selectVessel() {
    if (this.selectedVessel) {
      this.vesselNotifier.emit(true)
    } else {
      this.vesselNotifier.emit(false)
    }
  }
}
