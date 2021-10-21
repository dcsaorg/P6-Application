import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NegotiationCycle} from "../../../model/portCall/negotiation-cycle";
import {Timestamp} from "../../../model/ovs/timestamp";
import {Globals} from "../../../model/portCall/globals";

@Injectable({
  providedIn: 'root'
})
export class NegotiationCycleService {
  private readonly NEGOTIATION_CYCLE_BACKEND: string;
  private negotiationCycles: Map<string, NegotiationCycle> = new Map<string, NegotiationCycle>();

  constructor(private httpClient: HttpClient,
              private globals: Globals) {
    this.NEGOTIATION_CYCLE_BACKEND = globals.config.uiSupportBackendURL + '/unofficial/negotiation-cycles';
    this.getNegotiationCycles().subscribe(negotiationCycles => {
      let map = new Map<string, NegotiationCycle>();
      for (let cycle of negotiationCycles) {
        map.set(cycle.cycleKey, cycle);
      }
      this.negotiationCycles = map;
    });
  }

  getNegotiationCycles = (): Observable<NegotiationCycle[]> => this.httpClient.get<NegotiationCycle[]>(this.NEGOTIATION_CYCLE_BACKEND);

  enrichTimestampWithNegotiationCycle(timestamp: Timestamp): NegotiationCycle {
    const negotiationCycleKey: string = timestamp.timestampDefinition.negotiationCycle;
    let negotiationCycle = this.negotiationCycles.get(negotiationCycleKey);
    if (!negotiationCycle) {
      negotiationCycle = new class implements NegotiationCycle {
        cycleKey: string = negotiationCycleKey;
        cycleName: string = "Unnamed (" + negotiationCycleKey + ")";
      }
    }
    timestamp.negotiationCycle = negotiationCycle;
    return negotiationCycle;
  }
}
