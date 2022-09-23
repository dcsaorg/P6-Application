import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TransportCallService } from "../../controller/services/jit/transport-call.service";
import { TransportCall } from "../../model/jit/transport-call";
import { DialogService } from "primeng/dynamicdialog";
import { TransportCallCreatorComponent } from "../transport-call-creator/transport-call-creator.component";
import { TranslateService } from "@ngx-translate/core";
import { PortService } from 'src/app/controller/services/base/port.service';
import { TransportCallFilterService } from 'src/app/controller/services/base/transport-call-filter.service';
import { Port } from 'src/app/model/portCall/port';
import { take } from 'rxjs/operators';
import { VesselService } from "../../controller/services/base/vessel.service";
import { Vessel } from "../../model/portCall/vessel";
import { MessageService } from "primeng/api";
import { ErrorHandler } from 'src/app/controller/services/util/errorHandler';

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
  filterVessel: Vessel;
  ports: Port[] = [];
  progressing: boolean = true;

  @Output() transportCallNotifier: EventEmitter<TransportCall> = new EventEmitter<TransportCall>()

  constructor(private transportCallService: TransportCallService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private vesselService: VesselService,
    private portFilterService: TransportCallFilterService,
    private portService: PortService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.portService.getPorts().pipe(take(1)).subscribe(async ports => {
      this.ports = ports
      await this.loadTransportCalls()
    });
    this.vesselService.vesselsObservable.subscribe(async () => {
      await this.loadTransportCalls()
    })
    this.portFilterService.portObservable.subscribe(async port => {
      this.filterPort = port
      await this.refreshTransportCalls()
    })
    this.portFilterService.vesselObservable.subscribe(async vessel => {
      this.filterVessel = vessel;
      await this.refreshTransportCalls();
    })
  }

  selectTransportCall(event) {
    this.transportCallNotifier.emit(event.data);
  }

  unselectTransportCall(): void {
    this.transportCallNotifier.emit(null);
  }

  isOmitted(transportCall: TransportCall): boolean {
    if (!transportCall.omitCreatedDateTime) {
      return false;
    }
    return transportCall.omitCreatedDateTime >= transportCall.latestEventCreatedDateTime;
  }

  async refreshTransportCalls(): Promise<void> {
    this.progressing = true;
    const transportCalls = await this.loadTransportCalls();
    if (this.selectedtransportCall && !transportCalls.some(x => x.transportCallID === this.selectedtransportCall.transportCallID)) {
      this.transportCallNotifier.emit(null);
    }
  }

  openCreationDialog() {
    const transportCallEditor = this.dialogService.open(TransportCallCreatorComponent, {
      header: this.translate.instant('general.portVisit.create'),
      width: '75%'
    });
    transportCallEditor.onClose.subscribe(async result => {
      if (result) {
        await this.refreshTransportCalls();
      }
    })
  }

  async loadTransportCalls(): Promise<TransportCall[]> {
    return new Promise(resolve => {
      this.transportCallService.getTransportCalls(this.filterPort?.UNLocationCode, this.filterVessel?.vesselIMONumber).subscribe({
        next: (transportCalls) => {
          this.progressing = false;
          this.transportCalls = transportCalls;
          resolve(transportCalls);
        },
        error: errorResponse => {
          let errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse);
          this.messageService.add(
            {
              key: 'GenericErrorToast',
              severity: 'error',
              summary: 'Transport calls not found',
              detail: errorMessage
            })
          this.progressing = false;
        }
      })
    })
  }
  
}
