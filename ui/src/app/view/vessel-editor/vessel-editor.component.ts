import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Vessel} from "../../model/vessel";
import {VesselService} from "../../controller/vessel.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-vessel-editor',
  templateUrl: './vessel-editor.component.html',
  styleUrls: ['./vessel-editor.component.scss']
})
export class VesselEditorComponent implements OnInit {
  vessel: Vessel;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private vesselService: VesselService, private messageService: MessageService) {
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
      this.vesselService.updateVessel(this.vessel).subscribe(() => {
          this.messageService.add({
            key: 'vesselUpdateSuccess',
            severity: 'success',
            summary: 'Successfully updated vessel',
            detail: ''
          });
          this.ref.close(this.vessel);
        }, error => {
          this.messageService.add({
            key: 'vesselUpdateError',
            severity: 'error',
            summary: 'Error while updating vessel',
            detail: error.message
          });
        });
    } else {
      this.vesselService.addVessel(this.vessel).subscribe((newVessel: Vessel) => {
        this.messageService.add({
          key: 'vesselAddSuccess',
          severity: 'success',
          summary: 'Successfully added vessel',
          detail: ''
        });
        this.ref.close(newVessel);
      }, error => this.messageService.add({
        key: 'vesselAddError',
        severity: 'error',
        summary: 'Error while adding vessel',
        detail: error.message
      }));
    };
  }

  cancel() {
    this.ref.close(null);
  }
}
