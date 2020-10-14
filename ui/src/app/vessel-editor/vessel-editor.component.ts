import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Vessel} from "../model/vessel";
import {VesselService} from "../vessel.service";

@Component({
  selector: 'app-vessel-editor',
  templateUrl: './vessel-editor.component.html',
  styleUrls: ['./vessel-editor.component.scss']
})
export class VesselEditorComponent implements OnInit {
  vessel: Vessel;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private vesselService: VesselService) {
  }

  ngOnInit(): void {
    if (this.config.data) {
      this.vessel = this.config.data;
    } else {
      this.vessel = {id: null, name: "", imo: null, teu: null, serviceNameCode: ""};
    }
  }

  saveVessel() {
    if (this.config.data) {
      this.vesselService.updateVessel(this.vessel)
    } else {
      this.vesselService.addVessel(this.vessel)
    }
    this.ref.close(this.vessel);
  }

  cancel() {
    this.ref.close(null);
  }
}
