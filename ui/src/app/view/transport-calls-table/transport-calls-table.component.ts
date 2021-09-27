import {Component, EventEmitter, OnInit, Output, SimpleChanges} from '@angular/core';
import {TransportCallService} from "../../controller/services/ovs/transport-call.service";
import {TransportCall} from "../../model/ovs/transport-call";
import {DialogService} from "primeng/dynamicdialog";
import {TransportCallCreatorComponent} from "../transport-call-creator/transport-call-creator.component";
import {TranslateService} from "@ngx-translate/core";
import {PortService} from 'src/app/controller/services/base/port.service';
import {PortIdToPortPipe} from 'src/app/controller/pipes/port-id-to-port.pipe';
import {PortFilterService} from 'src/app/controller/services/base/portfilter.service';
import {Port} from 'src/app/model/portCall/port';
import {Terminal} from 'src/app/model/portCall/terminal';
import {take} from 'rxjs/operators';
import {VesselService} from "../../controller/services/base/vessel.service";

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
  ports: Port[] = [];

  @Output() transportCallNotifier: EventEmitter<TransportCall> = new EventEmitter<TransportCall>()

  constructor(private transportCallService: TransportCallService,
              private dialogService: DialogService,
              private vesselService: VesselService,
              private portFilterService: PortFilterService,
              private portService: PortService,
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.portService.getPorts().pipe(take(1)).subscribe(ports => {
      this.ports = ports
      this.loadTransportCalls()
    });
    this.vesselService.vesselsObservable.subscribe(() => {
      this.loadTransportCalls()
    })
    this.portFilterService.portObservable.subscribe(port => {
      this.filterPort = port
      this.refreshTransportCalls()
    })
    this.portFilterService.terminalObservable.subscribe(terminal => {
      this.filterTerminal = terminal
      this.refreshTransportCalls()
    })
  }

  selectTransportCall(event) {
    this.transportCallNotifier.emit(event.data);
  }

  unselectTransportCall(): void {
    this.transportCallNotifier.emit(null);
  }

  refreshTransportCalls(): void {
    this.loadTransportCalls()
    this.transportCallNotifier.emit(null);
  }

  openCreationDialog() {
    const transportCallEditor = this.dialogService.open(TransportCallCreatorComponent, {
      header: this.translate.instant('general.transportCall.create'),
      width: '75%'
    });
    transportCallEditor.onClose.subscribe(result => {
      if (result) {
        this.refreshTransportCalls();
      }
    })
  }

  loadTransportCalls(): void {
    this.transportCallService.getTransportCalls(this.filterPort?.unLocode, this.filterTerminal?.smdgCode).subscribe(transportCalls => {
      this.transportCalls = transportCalls;
    })
  }
}
