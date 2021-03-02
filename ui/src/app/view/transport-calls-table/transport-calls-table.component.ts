import { Component, OnInit } from '@angular/core';
import {TransportCallService} from "../../controller/services/OVS/transport-call.service";
import {TransportCall} from "../../model/OVS/transport-call";

@Component({
  selector: 'app-transport-calls-table',
  templateUrl: './transport-calls-table.component.html',
  styleUrls: ['./transport-calls-table.component.scss']
})
export class TransportCallsTableComponent implements OnInit {
  transportCall: TransportCall[] = []
  selectedtransportCall: TransportCall;
  constructor(private traansportCallService: TransportCallService) { }

  ngOnInit(): void {
    this.traansportCallService.getTransportCalls().subscribe(transportCalls => {
      this.transportCall = transportCalls;
    })
  }

  selectTransportCall(event){
    console.log(event.data.transportCallID);
  }

}
