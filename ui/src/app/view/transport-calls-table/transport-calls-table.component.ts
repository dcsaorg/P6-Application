import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TransportCallService} from "../../controller/services/ovs/transport-call.service";
import {TransportCall} from "../../model/ovs/transport-call";
import {DialogService} from "primeng/dynamicdialog";
import {TransportCallCreatorComponent} from "../transport-call-creator/transport-call-creator.component";
import {TranslateService} from "@ngx-translate/core";
import { PortService } from 'src/app/controller/services/base/port.service';
import { PortIdToPortPipe } from 'src/app/controller/pipes/port-id-to-port.pipe';
import { PortFilterService } from 'src/app/controller/services/base/portfilter.service';
import { Port } from 'src/app/model/portCall/port';
import { Terminal } from 'src/app/model/portCall/terminal';

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
  filterPort: Port;
  filterTerminal: Terminal;

  @Output() transportCallNotifier: EventEmitter<TransportCall> = new EventEmitter<TransportCall>()

  constructor(private transportCallService: TransportCallService,
              private dialogService: DialogService,
              private portFilterService: PortFilterService,
              private translate: TranslateService) { }

  ngOnInit(): void {
    this.loadTransportCalls()
    this.portFilterService.portObservable.subscribe(port => {
      this.filterPort = port
      this.refreshTransportCalls()
    })
    this.portFilterService.terminalObservable.subscribe(terminal => {
      this.filterTerminal = terminal
      this.refreshTransportCalls()
    })
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
      header: this.translate.instant('general.transportCall.create'),
      width: '75%'
    });
    transportCallEditor.onClose.subscribe(result => {
      if(result){
        this.refreshTransportCalls();
      }
    })
  }

  loadTransportCalls():void{
    this.transportCallService.getTransportCalls(this.filterPort?.unLocode, this.filterTerminal?.smdgCode).subscribe(transportCalls => {
      this.transportCalls = transportCalls;
    })
  }
}
