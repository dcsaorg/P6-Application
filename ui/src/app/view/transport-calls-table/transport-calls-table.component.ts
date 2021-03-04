import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TransportCallService} from "../../controller/services/OVS/transport-call.service";
import {TransportCall} from "../../model/OVS/transport-call";
import {PortcallTimestamp} from "../../model/base/portcall-timestamp";

@Component({
  selector: 'app-transport-calls-table',
  templateUrl: './transport-calls-table.component.html',
  styleUrls: ['./transport-calls-table.component.scss']
})
export class TransportCallsTableComponent implements OnInit {
  transportCalls: TransportCall[] = []
  selectedtransportCall: TransportCall;

  @Output() transportCallNotifier: EventEmitter<TransportCall> = new EventEmitter<TransportCall>()

  constructor(private transportCallService: TransportCallService) { }

  ngOnInit(): void {
    this.loadTransportCalls()
  }

  selectTransportCall(event){
    this.transportCallNotifier.emit(event.data);
  }

  refreshTransportCalls(): void {
    this.loadTransportCalls()
    // deactivate PortCallTimestamps
    this.transportCallNotifier.emit(null);

  }

  loadTransportCalls():void{
    this.transportCallService.getTransportCalls().subscribe(transportCalls => {
      this.transportCalls = transportCalls;
      this.colorizeBySchedule(this.transportCalls)
    })
  }

  private colorizeBySchedule(transportCalls: TransportCall[]){

    let colourPalette:string[] = new Array("#30a584","#f5634a","#d00fc2","#fad089", "#78b0ee", "#19ee79", "#d0a9ff", "#ff9d00", "#b03e3e", "#0400ff")

    let processIDs = new Map();
    // extract processIDs
    transportCalls.forEach(function (transportCall){
      processIDs.set(transportCall.scheduleID, null);
    });
    let i = 0
    // assign color to transportCallID
    for (let key of processIDs.keys()){
      processIDs.set(key, colourPalette[i]);
      i++;
      if(i==colourPalette.length){
        i=0;
      }
    }
    //assign color to timestamp
    transportCalls.forEach(function (timestamp){
      timestamp.sequenceColor = processIDs.get(timestamp.scheduleID);
    });
  }

}
