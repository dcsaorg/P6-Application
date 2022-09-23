import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Globals } from "../../../model/portCall/globals";
import { TimestampDefinitionTO } from "../../../model/jit/timestamp-definition";
import { map, shareReplay } from 'rxjs/operators';
import { NegotiationCycle } from 'src/app/model/portCall/negotiation-cycle';
import {PortCallPart} from "../../../model/portCall/port-call-part";

function asMap(timestampDefinitions: TimestampDefinitionTO[]): Map<string, TimestampDefinitionTO> {
  let map = new Map<string, TimestampDefinitionTO>()
  for (let timestampDefinitionTO of timestampDefinitions) {
    map.set(timestampDefinitionTO.id, timestampDefinitionTO);
  }
  return map;
}

function negotiationCycleComparator(a: NegotiationCycle, b: NegotiationCycle): number {
  const ao = a.displayOrder ?? 999
  const bo = b.displayOrder ?? 999
  if (ao > bo) {
    return 1
  }
  if (ao == bo) {
    return 0
  }
  return -1
}

@Injectable({
  providedIn: 'root'
})
export class TimestampDefinitionService {
  private readonly TIMESTAMP_DEFINITION_BACKEND: string;
  // the timestamps are not likely to change during a work session.
  private negotiationCyclesCache$: Observable<NegotiationCycle[]>;
  private portCallPartCache$: Observable<PortCallPart[]>;
  private definitionCache$: Observable<TimestampDefinitionTO[]>;
  private definitionMapCache$: Observable<Map<string, TimestampDefinitionTO>>;

  constructor(private httpClient: HttpClient,
              private globals: Globals) {
    this.TIMESTAMP_DEFINITION_BACKEND = globals.config.uiSupportBackendURL + '/unofficial/timestamp-definitions';
  }

  getTimestampDefinitions(): Observable<TimestampDefinitionTO[]> {
    if (!this.definitionCache$) {
      this.definitionCache$ = this.httpClient.get<TimestampDefinitionTO[]>(this.TIMESTAMP_DEFINITION_BACKEND)
        .pipe(
          map(definitions => {
            let table = asMap(definitions);
            // Set up links between "timestampDefinitionTO"s.
            for (let timestampDefinitionTO of definitions) {
              if (timestampDefinitionTO.acceptTimestampDefinition) {
                timestampDefinitionTO.acceptTimestampDefinitionEntity = table.get(timestampDefinitionTO.acceptTimestampDefinition)
              }
              if (timestampDefinitionTO.rejectTimestampDefinition) {
                timestampDefinitionTO.rejectTimestampDefinitionEntity = table.get(timestampDefinitionTO.rejectTimestampDefinition)
              }
            }
            return definitions;
          }),
          shareReplay(1)
        ) as Observable<TimestampDefinitionTO[]>;
    }
    return this.definitionCache$;
  }

  getNegotiationCycles(): Observable<NegotiationCycle[]> {
    if (!this.negotiationCyclesCache$) {
      this.negotiationCyclesCache$ = this.getTimestampDefinitions().pipe(
        map(timestampDefinitions => {
          let uniqueNegotiationCycles: NegotiationCycle[] = [];
          timestampDefinitions.forEach(timestampDefinitionTO => {
            if (uniqueNegotiationCycles.find(ng => ng.cycleKey === timestampDefinitionTO.negotiationCycle.cycleKey)) {
              return;
            } else {
              uniqueNegotiationCycles.push(timestampDefinitionTO.negotiationCycle)
            }
          })
          uniqueNegotiationCycles.sort(negotiationCycleComparator)
          return uniqueNegotiationCycles
        }),
        shareReplay(1)
      ) as Observable<NegotiationCycle[]>
    }
    return this.negotiationCyclesCache$;
  }

  getPortCallParts(): Observable<PortCallPart[]> {
    if (!this.portCallPartCache$) {
      this.portCallPartCache$ = this.getTimestampDefinitions().pipe(
        map(timestampDefinitions => {
          const uniquePortCallParts = new Set<string>();
          for (const timestampDefinition of timestampDefinitions) {
            uniquePortCallParts.add(timestampDefinition.portCallPart);
          }
          const portCallParts = Array.from(uniquePortCallParts.values());
          portCallParts.sort();
          return portCallParts.map(n => {
            return {
              name: n
            };
          });
        }),
        shareReplay(1)
      );
    }
    return this.portCallPartCache$;
  }

  getTimestampDefinitionsMap(): Observable<Map<string, TimestampDefinitionTO>> {
    if (!this.definitionMapCache$) {
      this.definitionMapCache$ = this.getTimestampDefinitions().pipe(
        map(timestampDefinitions => {
          return asMap(timestampDefinitions);
        }),
        shareReplay(1)
      ) as Observable<Map<string, TimestampDefinitionTO>>;
    }
    return this.definitionMapCache$;
  }
}
