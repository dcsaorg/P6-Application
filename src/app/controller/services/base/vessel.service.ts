import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, distinctUntilChanged, Observable, of, tap} from 'rxjs';

import {Vessel} from '../../../model/portCall/vessel';
import {Carrier} from '../../../model/portCall/carrier';
import {Globals} from '../../../model/portCall/globals';

@Injectable({
  providedIn: 'root'
})
export class VesselService {
  private vesselsDataSource = new BehaviorSubject<Vessel>(null);
  // The transport-call-table needs to fetch each vessel. Cache vessels as we see them to speed that process up
  // a bit.
  private vesselCache = new Map<string, Vessel>();
  vesselsObservable$ = this.vesselsDataSource.asObservable().pipe(
    distinctUntilChanged()
  );

  private readonly VESSEL_URL: string;
  private readonly CARRIER_URL: string;

  constructor(private httpClient: HttpClient, globals: Globals) {
    this.VESSEL_URL = globals.config.uiSupportBackendURL + '/unofficial/vessels';
    this.CARRIER_URL = globals.config.uiSupportBackendURL + '/unofficial/carriers';
  }

  getVessels(): Observable<Vessel[]> {
    return this.httpClient.get<Vessel[]>(this.VESSEL_URL + '?limit=1000').pipe(
      tap(vessels => {
        this.vesselCache.clear();
        for (const vessel of vessels) {
          this.vesselCache.set(vessel.vesselIMONumber, vessel);
        }
      })
    );
  }

  getVessel(vesselIMONumber: string): Observable<Vessel> {
    const vessel = this.vesselCache.get(vesselIMONumber);
    if (vessel) {
      return of(vessel);
    }
    return this.cacheVessel(this.httpClient.get<Vessel>(this.VESSEL_URL + '/' + vesselIMONumber));
  }

  updateVessel(vessel: Vessel): Observable<Vessel>{
    return this.cacheVessel(this.httpClient.put<Vessel>(this.VESSEL_URL + '/' + vessel.vesselIMONumber, vessel));
  }

  addVessel(vessel: Vessel): Observable<Vessel> {
    return this.cacheVessel(this.httpClient.post<Vessel>(this.VESSEL_URL, vessel));
  }

  getCarriers = (): Observable<Carrier[]> =>  this.httpClient.get<Carrier[]>(this.CARRIER_URL);

  newVesselObservable(vessel: Vessel): void {
    this.vesselsDataSource.next(vessel);
  }

  private cacheVessel(vesselObservable: Observable<Vessel>): Observable<Vessel> {
    return vesselObservable.pipe(
      tap(v => this.vesselCache.set(v.vesselIMONumber, v))
    );
  }
}
