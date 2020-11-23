import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {SelectItem} from "primeng/api";
import {Vessel} from "../../model/vessel";
import {DialogService} from "primeng/dynamicdialog";
import {VesselEditorComponent} from "../vessel-editor/vessel-editor.component";
import {VesselService} from "../../controller/vessel.service";
import {Port} from "../../model/port";

@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.scss'],
  providers: [
    DialogService
  ]
})
export class VesselComponent implements OnInit, OnChanges {
  @Input('ports') ports: Port[];
  portOptions: SelectItem[] = [];
  portOfCall: Port;

  vessels: SelectItem[];
  selectedVessel: Vessel;

  constructor(public dialogService: DialogService, private vesselService: VesselService) {
  }

  @Output() vesselNotifier: EventEmitter<number> = new EventEmitter<number>()
  @Output() portOfCallNotifier: EventEmitter<Port> = new EventEmitter<Port>()

  ngOnInit(): void {
    this.updateVesselOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePortOptions();
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

  selectPortOfCall = () => this.portOfCallNotifier.emit(this.portOfCall);

  updatePortOptions = () => {
    this.portOptions = [];
    this.portOptions.push({label: 'Select port', value: null})
    this.ports.forEach(port => {
      this.portOptions.push({label: port.unLocode, value: port})
    });
  }
}
