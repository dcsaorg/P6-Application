import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Port} from 'src/app/model/portCall/port';
import {Vessel} from '../../../model/portCall/vessel';

@Injectable() export class TransportCallFilterService {
    private portDataSource = new BehaviorSubject<Port>(null);
    portObservable$ = this.portDataSource.asObservable();

    private vesselDataSource = new BehaviorSubject<Vessel>(null);
    vesselObservable$ = this.vesselDataSource.asObservable();

    updatePortFilter(port: Port): void {
        this.portDataSource.next(port);
    }

    updateVesselFilter(vessel: Vessel): void {
        this.vesselDataSource.next(vessel);
    }
}
