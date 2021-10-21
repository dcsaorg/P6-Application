import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NegotiationCycle} from "../../../model/portCall/negotiation-cycle";
import {Timestamp} from "../../../model/ovs/timestamp";

@Injectable({
  providedIn: 'root'
})
export class NegotiationCycleService {
  private readonly NEGOTIATION_CYCLE_FILE: string;
  private negotiationCycles: NegotiationCycle[] = [];

  constructor(private httpClient: HttpClient) {
    this.NEGOTIATION_CYCLE_FILE = '/assets/static_data/negotiationcycles.json';
    this.getNegotiationCycles().subscribe(negotiationCycles => this.negotiationCycles = negotiationCycles);
  }

  getNegotiationCycles = (): Observable<NegotiationCycle[]> => this.httpClient.get<NegotiationCycle[]>(this.NEGOTIATION_CYCLE_FILE);

  enrichTimestampWithNegotiationCycle(timestamp: Timestamp): NegotiationCycle {
    const negotiationCycleKey: string = timestamp.timestampDefinition.negotiationCycle;
    let negotiationCycle = this.negotiationCycles.find(nc => nc.cycleKey == negotiationCycleKey, null);
    if (!negotiationCycle) {
      negotiationCycle = new class implements NegotiationCycle {
        cycleKey: string = negotiationCycleKey;
        name: string = "Unnamed (" + negotiationCycleKey + ")";
      }
    }
    timestamp.negotiationCycle = negotiationCycle;
    return negotiationCycle;
  }
}
