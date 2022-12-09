import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {mergeMap, Observable} from 'rxjs';
import { Globals } from '../../../model/portCall/globals';
import { TimestampDefinitionTO } from '../../../model/jit/timestamp-definition';
import {filter, map, shareReplay} from 'rxjs/operators';
import { NegotiationCycle } from 'src/app/model/portCall/negotiation-cycle';
import {PortCallPart} from '../../../model/portCall/port-call-part';
import {PublisherRole} from '../../../model/enums/publisherRole';

function asMap(timestampDefinitions: TimestampDefinitionTO[]): Map<string, TimestampDefinitionTO> {
  const tsMap = new Map<string, TimestampDefinitionTO>();
  for (const timestampDefinitionTO of timestampDefinitions) {
    tsMap.set(timestampDefinitionTO.id, timestampDefinitionTO);
  }
  return tsMap;
}

function negotiationCycleComparator(a: NegotiationCycle, b: NegotiationCycle): number {
  const ao = a.displayOrder ?? 999;
  const bo = b.displayOrder ?? 999;
  if (ao > bo) {
    return 1;
  }
  if (ao === bo) {
    return 0;
  }
  return -1;
}

@Injectable({
  providedIn: 'root'
})
export class TimestampDefinitionService {
  private readonly TIMESTAMP_DEFINITION_BACKEND: string;
  private readonly PORT_CALL_PART_BACKEND: string;
  // the timestamps are not likely to change during a work session.
  private negotiationCyclesCache$: Observable<NegotiationCycle[]>;
  private portCallPartCache$: Observable<PortCallPart[]>;
  private definitionCache$: Observable<TimestampDefinitionTO[]>;
  private definitionMapCache$: Observable<Map<string, TimestampDefinitionTO>>;

  constructor(private httpClient: HttpClient,
              private globals: Globals) {
    this.TIMESTAMP_DEFINITION_BACKEND = globals.config.uiSupportBackendURL + '/unofficial/timestamp-definitions';
    this.PORT_CALL_PART_BACKEND = globals.config.uiSupportBackendURL + '/unofficial/port-call-parts';
  }

  getTimestampDefinitions(): Observable<TimestampDefinitionTO[]> {
    if (!this.definitionCache$) {
      this.definitionCache$ = this.httpClient.get<TimestampDefinitionTO[]>(this.TIMESTAMP_DEFINITION_BACKEND)
        .pipe(
          map(definitions => {
            const table = asMap(definitions);
            // Set up links between "timestampDefinitionTO"s.
            for (const timestampDefinitionTO of definitions) {
              if (timestampDefinitionTO.acceptTimestampDefinition) {
                timestampDefinitionTO.acceptTimestampDefinitionEntity = table.get(timestampDefinitionTO.acceptTimestampDefinition);
              }
              if (timestampDefinitionTO.rejectTimestampDefinition) {
                timestampDefinitionTO.rejectTimestampDefinitionEntity = table.get(timestampDefinitionTO.rejectTimestampDefinition);
              }
            }
            return definitions;
          }),
          shareReplay({
            bufferSize: 1,
            // Keep cached (it changes rarely and not very large)
            refCount: false,
          })
        );
    }
    return this.definitionCache$;
  }

  getNegotiationCycles(): Observable<NegotiationCycle[]> {
    if (!this.negotiationCyclesCache$) {
      this.negotiationCyclesCache$ = this.getTimestampDefinitions().pipe(
        map(timestampDefinitions => {
          const uniqueNegotiationCycles: NegotiationCycle[] = [];
          timestampDefinitions.forEach(timestampDefinitionTO => {
            if (uniqueNegotiationCycles.find(ng => ng.cycleKey === timestampDefinitionTO.negotiationCycle.cycleKey)) {
              return;
            } else {
              uniqueNegotiationCycles.push(timestampDefinitionTO.negotiationCycle);
            }
          });
          uniqueNegotiationCycles.sort(negotiationCycleComparator);
          return uniqueNegotiationCycles;
        }),
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );
    }
    return this.negotiationCyclesCache$;
  }

  getNegotiationCyclesForPublisherRoles(publisherRoles: Set<PublisherRole>): Observable<NegotiationCycle[]> {
    return this.getTimestampDefinitions().pipe(
      map(timestamps => {
        return new Set<string>(
          timestamps.filter(ts => ts.publisherPattern.find(pp => publisherRoles.has(pp.publisherRole)))
              .map(ts => ts.negotiationCycle.cycleKey));
      }),
      mergeMap(interestingNegotiationCycles => this.getNegotiationCycles().pipe(
        map(negotiationCycles => negotiationCycles.filter(nc => interestingNegotiationCycles.has(nc.cycleKey)))
      ))
    );
  }

  getPortCallParts(): Observable<PortCallPart[]> {
    if (!this.portCallPartCache$) {
      this.portCallPartCache$ = this.httpClient.get<PortCallPart[]>(this.PORT_CALL_PART_BACKEND).pipe(
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
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
        shareReplay({
          bufferSize: 1,
          refCount: true,
        })
      );
    }
    return this.definitionMapCache$;
  }
}
