import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TransportCallService} from '../../controller/services/jit/transport-call.service';
import {TransportCall} from '../../model/jit/transport-call';
import {DialogService} from 'primeng/dynamicdialog';
import {TransportCallCreatorComponent} from '../transport-call-creator/transport-call-creator.component';
import {TranslateService} from '@ngx-translate/core';
import {PortService} from 'src/app/controller/services/base/port.service';
import {TransportCallFilterService} from 'src/app/controller/services/base/transport-call-filter.service';
import {BehaviorSubject, combineLatest, debounce, interval, mergeMap, Observable, Subject, take, takeUntil} from 'rxjs';
import {VesselService} from '../../controller/services/base/vessel.service';
import {MessageService} from 'primeng/api';
import {ErrorHandler} from 'src/app/controller/services/util/errorHandler';
import {filter, tap} from 'rxjs/operators';
import {TimestampService} from '../../controller/services/jit/timestamps.service';

@Component({
  selector: 'app-transport-calls-table',
  templateUrl: './transport-calls-table.component.html',
  styleUrls: ['./transport-calls-table.component.scss'],
  providers: [
    DialogService]
})

export class TransportCallsTableComponent implements OnInit, OnDestroy {
  transportCalls$: Observable<TransportCall[]>;
  selectedTransportCall: TransportCall;
  refreshTrigger = new BehaviorSubject<any>(null);
  @Output() transportCallNotifier: EventEmitter<TransportCall> = new EventEmitter<TransportCall>();
  private unsubscribe$ = new Subject<void>();

  constructor(
    private transportCallService: TransportCallService,
    private messageService: MessageService,
    private dialogService: DialogService,
    private vesselService: VesselService,
    private portFilterService: TransportCallFilterService,
    private portService: PortService,
    private timestampService: TimestampService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.transportCalls$ = this.fetchTransportCalls();
    this.timestampService.newTimestampNotifier$.pipe(
      takeUntil(this.unsubscribe$),
      filter(_ => !!this.selectedTransportCall),
      tap(_ => this.refreshTransportCalls()),
    ).subscribe();
  }

  selectTransportCall(event): void {
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

  refreshTransportCalls(): void {
    this.refreshTrigger.next(null);
  }

  openCreationDialog(): void {
    const transportCallEditor = this.dialogService.open(TransportCallCreatorComponent, {
      header: this.translate.instant('general.portVisit.create'),
      width: '75%'
    });
    transportCallEditor.onClose.pipe(take(1)).subscribe(result => {
      if (result) {
        this.refreshTransportCalls();
      }
    });
  }

  fetchTransportCalls(): Observable<TransportCall[]> {
    // The getPortsCall ensures all ports are cached.
    return this.portService.getPorts().pipe(
      mergeMap(_ => {
        return combineLatest([
          this.portFilterService.portObservable$,
          this.portFilterService.vesselObservable$,
          this.vesselService.vesselChanged$,
          this.refreshTrigger,
        ]);
      }),
      debounce(_ => interval(200)),
      mergeMap(([
                  filterPort,
                  filterVessel,
                  _a,  // Unused (used as a reload-trigger-only to refresh vessel information)
                  _b,  // Unused (used as a reload-trigger-only - manual refresh request)
                ]) => {
        return this.transportCallService.getTransportCalls(filterPort?.UNLocationCode, filterVessel?.vesselIMONumber);
      }),
      tap({
        next: (transportCalls) => {
          if (this.selectedTransportCall) {
            const id = this.selectedTransportCall.transportCallID;
            this.selectedTransportCall = transportCalls.find(x => x.transportCallID === id) ?? null;
            // Even if the same transport call appeared, it might have changed. Accordingly, we always
            // notify listeners in this case.
            this.transportCallNotifier.emit(this.selectedTransportCall);
          }
        },
        error: (errorResponse) => {
          const errorMessage = ErrorHandler.getConcreteErrorMessage(errorResponse);
          this.messageService.add(
            {
              key: 'GenericErrorToast',
              severity: 'error',
              summary: 'Transport calls not found',
              detail: errorMessage
            });
        }}
      ),
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
