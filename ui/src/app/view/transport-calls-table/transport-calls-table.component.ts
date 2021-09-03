import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TransportCallService} from "../../controller/services/ovs/transport-call.service";
import {TransportCall} from "../../model/ovs/transport-call";
import {DialogService} from "primeng/dynamicdialog";
import {TransportCallCreatorComponent} from "../transport-call-creator/transport-call-creator.component";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-transport-calls-table',
  templateUrl: './transport-calls-table.component.html',
  styleUrls: ['./transport-calls-table.component.scss'],

  providers: [
    DialogService]
})


export class TransportCallsTableComponent implements OnInit {
  transportCalls: TransportCall[] = []
  selectedtransportCall: TransportCall;

  @Output() transportCallNotifier: EventEmitter<TransportCall> = new EventEmitter<TransportCall>()

  constructor(private transportCallService: TransportCallService,
              private dialogService: DialogService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.loadTransportCalls()
  }

  selectTransportCall(event){
    this.transportCallNotifier.emit(event.data);
  }

  refreshTransportCalls(): void {
    this.loadTransportCalls()
    this.transportCallNotifier.emit(null);

  }

  openCreationDialog(){
    const transportCallEditor = this.dialogService.open(TransportCallCreatorComponent, {
      header: this.translate.instant('general.schedule.create'),
      width: '75%'
    });
    transportCallEditor.onClose.subscribe(result => {
      if(result){
        this.refreshTransportCalls();
      }
    })
  }
  
  loadTransportCalls():void{
    this.transportCallService.getTransportCalls().subscribe(transportCalls => {
      this.transportCalls = transportCalls;
      console.log(transportCalls)
    })
  }
}
