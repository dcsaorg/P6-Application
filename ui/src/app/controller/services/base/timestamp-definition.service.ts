import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Globals} from "../../../model/portCall/globals";
import {TimestampDefinition} from "../../../model/jit/timestamp-definition";
import {map} from 'rxjs/operators';

function asMap(timestampDefinitions: TimestampDefinition[]): Map<string, TimestampDefinition> {
  let map = new Map<string, TimestampDefinition>()
  for (let timestampDefinition of timestampDefinitions) {
    map.set(timestampDefinition.id, timestampDefinition);
  }
  return map;
}

@Injectable({
  providedIn: 'root'
})
export class TimestampDefinitionService {
  private readonly TIMESTAMP_DEFINITION_BACKEND: string;
  // the timestamps are not likely to change during a work session.
  private definitionCache: TimestampDefinition[] = [];

  constructor(private httpClient: HttpClient,
              private globals: Globals) {
    this.TIMESTAMP_DEFINITION_BACKEND = globals.config.uiSupportBackendURL + '/unofficial/timestamp-definitions';
  }

  getTimestampDefinitions(): Observable<TimestampDefinition[]> {
    if (this.definitionCache.length == 0) {
      let httpParams = new HttpParams();
      httpParams = httpParams.set("limit", "250");
      return this.httpClient.get<TimestampDefinition[]>(this.TIMESTAMP_DEFINITION_BACKEND, {params: httpParams})
        .pipe(
          map(definitions => {
            let table = asMap(definitions);
            // Set up links between "TimestampDefinition"s.
            for (let timestampDefinition of definitions) {
              if (timestampDefinition.acceptTimestampDefinition) {
                timestampDefinition.acceptTimestampDefinitionEntity = table.get(timestampDefinition.acceptTimestampDefinition)
              }
              if (timestampDefinition.rejectTimestampDefinition) {
                timestampDefinition.rejectTimestampDefinitionEntity = table.get(timestampDefinition.rejectTimestampDefinition)
              }
            }
            return definitions;
          }),
          map(definitions => this.definitionCache = definitions)
        );
    }
    return of(this.definitionCache);
  }



  getTimestampDefinitionsMap(): Observable<Map<string, TimestampDefinition>> {
    return this.getTimestampDefinitions().pipe(
      map(timestampDefinitions => {
        return asMap(timestampDefinitions);
      })
    )
  }
}
