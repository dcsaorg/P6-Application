import {Component, OnInit} from '@angular/core';
import {SelectItem} from "primeng/api";
import {Vessel} from "../model/vessel";

@Component({
  selector: 'app-vessel',
  templateUrl: './vessel.component.html',
  styleUrls: ['./vessel.component.scss']
})
export class VesselComponent implements OnInit {
  vessels: SelectItem[];
  selectedVessel: Vessel;

  constructor() {
  }

  ngOnInit(): void {
    this.vessels = [
      {label: 'Select Vessel', value: null},
      {label: 'Vessel 1', value: "v1"},
      {label: 'Vessel 2', value: "v2"}
    ]
  }

}
