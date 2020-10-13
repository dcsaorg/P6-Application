import {Component, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {Vessel} from "../model/vessel";
import {DialogService} from "primeng/dynamicdialog";
import {VesselEditorComponent} from "../vessel-editor/vessel-editor.component";

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

  constructor(public dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.vessels = [
      {label: 'Select Vessel', value: null},
      {label: 'Vessel 1', value: "v1"},
      {label: 'Vessel 2', value: "v2"}
    ]
  }

  createNewVessel() {
    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: 'Create a new vessel',
      width: '600px'
    });
    vesselEditor.onClose.subscribe()
  }

  editVessel() {
    const vesselEditor = this.dialogService.open(VesselEditorComponent, {
      header: 'Edit vessel',
      width: '600px',
      data: this.selectedVessel
    });
    vesselEditor.onClose.subscribe()
  }
}
