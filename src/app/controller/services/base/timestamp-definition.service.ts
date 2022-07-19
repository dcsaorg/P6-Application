import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Globals} from "../../../model/portCall/globals";
import {TimestampDefinitionTO} from "../../../model/jit/timestamp-definition";
import {map} from 'rxjs/operators';

function asMap(timestampDefinitions: TimestampDefinitionTO[]): Map<string, TimestampDefinitionTO> {
  let map = new Map<string, TimestampDefinitionTO>()
  for (let timestampDefinitionTO of timestampDefinitions) {
    map.set(timestampDefinitionTO.id, timestampDefinitionTO);
  }
  return map;
}

@Injectable({
  providedIn: 'root'
})
export class TimestampDefinitionService {
  private readonly TIMESTAMP_DEFINITION_BACKEND: string;
  // the timestamps are not likely to change during a work session.
  private definitionCache: TimestampDefinitionTO[] = [];

  constructor(private httpClient: HttpClient,
              private globals: Globals) {
    this.TIMESTAMP_DEFINITION_BACKEND = globals.config.uiSupportBackendURL + '/unofficial/timestamp-definitions';
  }

  getTimestampDefinitions(): Observable<TimestampDefinitionTO[]> {
    if (this.definitionCache.length == 0) {
      let httpParams = new HttpParams();
      httpParams = httpParams.set("canonicalTimestampDefinition", "NULL").set("limit", "250");
      return this.httpClient.get<TimestampDefinitionTO[]>(this.TIMESTAMP_DEFINITION_BACKEND, {params: httpParams})
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
          map(definitions => this.definitionCache = definitions)
        );
    }
    return of(this.definitionCache);
  }



  getTimestampDefinitionsMap(): Observable<Map<string, TimestampDefinitionTO>> {
    return this.getTimestampDefinitions().pipe(
      map(timestampDefinitions => {
        return asMap(timestampDefinitions);
      })
    )
  }
}
